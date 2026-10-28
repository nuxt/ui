import { readFileSync } from 'node:fs'
import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import { describe, it, expect } from 'vitest'
import { createHooks } from 'hookable'
import { nuxtCtx, runWithNuxtContext } from '@nuxt/kit'
import type { Nuxt, NuxtTemplate } from '@nuxt/schema'
import { addTemplates, getTemplates, prefixedClasses } from '../../src/templates'
import { defaultOptions, getDefaultConfig, resolveColors } from '../../src/utils/defaults'

function themeContents(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }) {
  const options = { ...defaultOptions, ...overrides, theme: { ...defaultOptions.theme, colors: resolveColors(undefined), ...(overrides.theme || {}) } }
  const templates = getTemplates(options as any, getDefaultConfig(options.theme), undefined, undefined, vue)
  return (filename: string) => templates.find(template => template.filename === filename)!.getContents!({} as any)
}

// `skeleton` is base-shaped (a single top-level `base` string). Both the
// detection blanking and `theme.unstyled` go through `applyUnstyled`, which
// used to miss that shape and ship those components' CSS anyway — so these
// assert on the emitted theme contents, not on the detected component list.
describe('theme templates', () => {
  it('blanks base-shaped themes for undetected components', async () => {
    const contents = themeContents({ experimental: { componentDetection: true } }, { detectedComponents: new Set(['Button']) })

    expect(await contents('ui/skeleton.ts')).not.toContain('animate-pulse')
    expect(await contents('ui/table.ts')).not.toContain('min-w-full')
    expect(await contents('ui/button.ts')).toContain('rounded-md')
  })

  it('blanks base-shaped themes with `theme.unstyled`', async () => {
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
