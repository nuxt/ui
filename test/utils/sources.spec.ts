import { cpSync, mkdirSync, mkdtempSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { join } from 'pathe'
import { describe, it, expect, afterAll } from 'vitest'
import colors from 'tailwindcss/colors'
import { getTemplates } from '../../src/templates'
import { defaultOptions, getDefaultConfig } from '../../src/utils/defaults'

// Tailwind's compiler and scanner, resolved through `@tailwindcss/vite`, which depends on both
const vite = createRequire(join(process.cwd(), 'package.json')).resolve('@tailwindcss/vite')
const load = (name: string) => import(pathToFileURL(createRequire(vite).resolve(name)).href)

const runtime = join(process.cwd(), 'src/runtime')
// Its real path, as the module resolves it (`/var` is a symlink on macOS)
const app = realpathSync(mkdtempSync(join(tmpdir(), 'nuxt-ui-sources-')))
// Installed the way users get it: under `node_modules`, which Tailwind treats as ignored
const dist = join(app, 'node_modules/@nuxt/ui/dist')

mkdirSync(join(dist, 'runtime/components'), { recursive: true })
for (const file of readdirSync(runtime).filter(file => file.endsWith('.css'))) {
  cpSync(join(runtime, file), join(dist, 'runtime', file))
}
cpSync(join(runtime, 'theme'), join(dist, 'runtime/theme'), { recursive: true })
cpSync(join(runtime, 'colors.ts'), join(dist, 'runtime/colors.ts'))
// The `./colors` export, pointing at the source the test copies
writeFileSync(join(dist, '../package.json'), JSON.stringify({ name: '@nuxt/ui', type: 'module', exports: { './colors': './dist/runtime/colors.ts' } }))
symlinkSync(join(process.cwd(), 'node_modules/tailwindcss'), join(app, 'node_modules/tailwindcss'))

afterAll(() => rmSync(app, { recursive: true, force: true }))

async function build(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }, css = '') {
  const options = { ...defaultOptions, ...overrides }
  const templates = getTemplates(options as any, getDefaultConfig(options.tailwindPrefix), undefined, (...paths: string[]) => join(dist, ...paths), vue)
  for (const filename of ['ui.css', 'ui.base.css']) {
    writeFileSync(join(app, filename), await templates.find(template => template.filename === filename)!.getContents!({} as any))
  }

  const { compile } = await load('@tailwindcss/node')
  const { Scanner } = await load('@tailwindcss/oxide')
  const tailwind = overrides.tailwindPrefix ? `@import "tailwindcss" prefix(${overrides.tailwindPrefix});` : '@import "tailwindcss";'
  const compiler = await compile(`${tailwind}\n@import "${join(dist, 'runtime/index.css')}";\n${css}`, {
    base: app,
    onDependency: () => {},
    customCssResolver: async (id: string) => id.startsWith('#build/') ? join(app, id.slice('#build/'.length)) : undefined
  })

  return compiler.build(new Scanner({ sources: compiler.sources }).scan()) as string
}

// `animate-pulse` only comes from the Skeleton theme
describe('package sources', () => {
  it('scans every theme by default', async () => {
    expect(await build({})).toContain('.animate-pulse')
  })

  it('leaves out the themes detection didn\'t find', async () => {
    const css = await build({ experimental: { componentDetection: true } }, { detectedComponents: new Set(['Button']) })

    expect(css).toContain('.rounded-md')
    expect(css).not.toContain('.animate-pulse')
  })
})

describe('colors plugin', () => {
  // The rule with that selector that sets the alias shades, not Tailwind's own `:root` tokens
  const rule = (css: string, selector: string) => [...css.matchAll(new RegExp(`${selector.replace(/[()]/g, '\\$&')} \\{([^}]*)\\}`, 'g'))]
    .map(match => match[1]!)
    .find(body => /^\s*--ui-color-/m.test(body)) ?? ''

  it('gives each alias its default palette at zero specificity', async () => {
    const defaults = rule(await build({}), ':where(:root, :host)')

    expect(defaults).toContain(`--ui-color-primary-500: ${colors.green[500]};`)
    expect(defaults).toContain(`--ui-color-neutral-950: ${colors.slate[950]};`)
  })

  it('follows a palette you override in `@theme`', async () => {
    const css = await build({}, undefined, '@theme static { --color-green-500: #00C16A; }')
    expect(rule(css, ':where(:root, :host)')).toContain('--ui-color-primary-500: #00C16A;')
  })

  it('points the aliases you pass at their palette', async () => {
    const css = await build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: indigo; neutral: neutral; }')
    const set = rule(css, ':root, :host')

    expect(set).toContain(`--ui-color-primary-500: ${colors.indigo[500]};`)
    // Tailwind's own neutral palette, which the `neutral` alias takes over
    expect(set).toContain(`--ui-color-neutral-500: ${colors.neutral[500]};`)
    expect(set).not.toContain('--ui-color-secondary')
  })

  it('resolves the palette with a Tailwind prefix', async () => {
    const css = await build({ tailwindPrefix: 'tw' }, undefined, '@plugin "@nuxt/ui/colors" { primary: indigo; }')

    expect(rule(css, ':root, :host')).toContain(`--ui-color-primary-500: ${colors.indigo[500]};`)
  })

  it('rejects an alias outside the set, a missing palette and another alias', async () => {
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { tertiary: indigo; }')).rejects.toThrow('`tertiary` isn\'t a color alias')
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: brand; }')).rejects.toThrow('`primary: brand` needs a Tailwind palette')
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: primary; }')).rejects.toThrow('`primary: primary` points a color alias at another')
  })
})
