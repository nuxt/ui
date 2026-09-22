import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolvePathSync } from 'mlly'
import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import { describe, it, expect, vi } from 'vitest'
import { createHooks } from 'hookable'
import { nuxtCtx, runWithNuxtContext } from '@nuxt/kit'
import type { Nuxt, NuxtTemplate } from '@nuxt/schema'
import { addTemplates, getTemplates, prefixedClasses } from '../../src/templates'
import { defaultOptions, getDefaultConfig, resolveColors } from '../../src/utils/defaults'

vi.mock('@nuxt/kit', async importOriginal => ({
  ...await importOriginal<typeof import('@nuxt/kit')>(),
  hasNuxtModule: () => false
}))

function themeContents(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }) {
  const options = { ...defaultOptions, ...overrides, theme: { ...defaultOptions.theme, colors: resolveColors(undefined), ...(overrides.theme || {}) } }
  const templates = getTemplates(options as any, getDefaultConfig(options.theme), undefined, undefined, vue)
  return (filename: string) => templates.find(template => template.filename === filename)!.getContents!({} as any)
}

// `skeleton` is a single-element theme, one `base` slot. Both the detection
// blanking and `theme.unstyled` go through `applyUnstyled`, so these assert on
// the emitted theme contents, not on the detected component list.
describe('theme templates', () => {
  it('blanks single-element themes for undetected components', async () => {
    const contents = themeContents({ experimental: { componentDetection: true } }, { detectedComponents: new Set(['Button']) })

    expect(await contents('ui/skeleton.ts')).not.toContain('animate-pulse')
    expect(await contents('ui/table.ts')).not.toContain('min-w-full')
    expect(await contents('ui/button.ts')).toContain('rounded-md')
  })

  it('blanks single-element themes with `theme.unstyled`', async () => {
    const contents = themeContents({ theme: { unstyled: true } })

    expect(await contents('ui/skeleton.ts')).not.toContain('animate-pulse')
  })

  it('skips prose themes with `prose: false`', () => {
    const hasProse = (overrides: Record<string, any>) => {
      const options = { ...defaultOptions, ...overrides, theme: { ...defaultOptions.theme, colors: resolveColors(undefined) } }
      return getTemplates(options as any, getDefaultConfig(options.theme)).some(template => template.filename === 'ui/prose/index.ts')
    }

    expect(hasProse({ content: true })).toBe(true)
    expect(hasProse({ content: true, prose: false })).toBe(false)
  })
})

describe('colors template', () => {
  const srcDir = join(process.cwd(), 'src')
  const colorsPath = JSON.stringify(resolvePathSync('tailwindcss/colors', { url: pathToFileURL(`${srcDir}/runtime/`).href }))

  function colorsContents(nuxt?: { options: { ssr: boolean } }) {
    const options = { ...defaultOptions, theme: { ...defaultOptions.theme, colors: resolveColors(undefined) } }
    const templates = getTemplates(options as any, getDefaultConfig(options.theme), nuxt as any, id => join(srcDir, id))
    return templates.find(template => template.filename === 'ui-colors.ts')!.getContents!({} as any)
  }

  it('loads the palette lazily with SSR', async () => {
    const contents = await colorsContents({ options: { ssr: true } })

    expect(contents).toContain(`import(${colorsPath})`)
    expect(contents).not.toContain(`from ${colorsPath}`)
  })

  it('bundles the palette without SSR', async () => {
    expect(await colorsContents({ options: { ssr: false } })).toContain(`import colors from ${colorsPath}`)
    expect(await colorsContents()).toContain(`import colors from ${colorsPath}`)
  })
})

describe('prefixedClasses', () => {
  it('lists every class components pass to `usePrefix`', () => {
    const componentDir = join(process.cwd(), 'src/runtime/components')
    const classes = new Set<string>()
    for (const file of globSync('**/*.vue', { cwd: componentDir })) {
      for (const [, value] of readFileSync(join(componentDir, file), 'utf8').matchAll(/\bprefix\(\s*'([^']+)'\s*\)/g)) {
        value!.split(/\s+/).filter(Boolean).forEach(cls => classes.add(cls))
      }
    }

    expect([...classes].sort()).toEqual(prefixedClasses)
  })

  it('adds them to `ui.css` with `theme.prefix`', async () => {
    const contents = themeContents({ theme: { prefix: 'tw' } })

    expect(await contents('ui.css')).toContain(`@source inline("${prefixedClasses.map(cls => `tw:${cls}`).join(' ')}");`)
  })
})

function createNuxt(): Nuxt {
  const hooks = createHooks()
  return {
    hooks,
    hook: hooks.hook,
    callHook: hooks.callHook,
    options: {
      dev: true,
      rootDir: '/app',
      srcDir: '/app/app',
      buildDir: '/app/.nuxt',
      alias: {},
      appConfig: {},
      app: {},
      modules: [],
      _installedModules: [],
      _layers: [{ cwd: '/app', config: { rootDir: '/app', srcDir: '/app/app' } }],
      build: { templates: [] },
      vite: {}
    }
  } as unknown as Nuxt
}

function moduleOptions(overrides: Record<string, any>) {
  return { ...defaultOptions, ...overrides, theme: { ...defaultOptions.theme, colors: resolveColors(undefined) } } as any
}

// The templates Nuxt recompiles when an existing file is saved, following the `dependsOn`
// contract: a template that declares nothing is always recompiled.
function recompiledOn(templates: NuxtTemplate[], nuxt: Nuxt, path: string) {
  return templates.filter(({ dependsOn, options }) => {
    if (typeof dependsOn === 'function') {
      return dependsOn({ event: 'change', path }, { nuxt, app: {} as any, options: options ?? {} })
    }
    return !dependsOn || dependsOn.length > 0
  }).map(template => template.filename)
}

describe('regeneration on file changes', () => {
  it('recompiles no template without component detection', () => {
    const nuxt = createNuxt()
    const templates = runWithNuxtContext(nuxt, () => getTemplates(moduleOptions({}), {}, nuxt, () => '/ui/runtime/components'))

    expect(recompiledOn(templates, nuxt, '/app/app/pages/index.vue')).toEqual([])
  })

  it('recompiles only `ui.css` when a scanned file changes with component detection', () => {
    const nuxt = createNuxt()
    const templates = runWithNuxtContext(nuxt, () => getTemplates(moduleOptions({ experimental: { componentDetection: true } }), {}, nuxt, () => '/ui/runtime/components'))

    expect(recompiledOn(templates, nuxt, '/app/app/pages/index.vue')).toEqual(['ui.css'])
    expect(recompiledOn(templates, nuxt, '/app/app/composables/useThing.ts')).toEqual(['ui.css'])
    expect(recompiledOn(templates, nuxt, '/app/server/api/thing.ts')).toEqual([])
    expect(recompiledOn(templates, nuxt, '/app/app/assets/main.css')).toEqual([])
  })

  it('leaves regeneration to Nuxt when a file changes', async () => {
    const nuxt = createNuxt()
    const requests: unknown[] = []
    nuxt.hook('builder:generateApp', options => void requests.push(options))
    nuxtCtx.set(nuxt)
    try {
      addTemplates(moduleOptions({ experimental: { componentDetection: true } }), nuxt, () => '/ui/runtime/components')
      await nuxt.callHook('builder:watch', 'change', 'pages/index.vue')
    } finally {
      nuxtCtx.unset()
    }

    expect(requests).toEqual([])
  })
})
