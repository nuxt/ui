import { cpSync, mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
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
cpSync(join(runtime, 'css'), join(dist, 'runtime/css'), { recursive: true })
cpSync(join(runtime, 'theme'), join(dist, 'runtime/theme'), { recursive: true })
// The `./colors` export, pointing at the source the test copies
writeFileSync(join(dist, '../package.json'), JSON.stringify({ name: '@nuxt/ui', type: 'module', exports: { './colors': './dist/runtime/css/colors.ts' } }))
symlinkSync(join(process.cwd(), 'node_modules/tailwindcss'), join(app, 'node_modules/tailwindcss'))

afterAll(() => rmSync(app, { recursive: true, force: true }))

async function build(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }, css = '', before = '') {
  const options = { ...defaultOptions, ...overrides }
  const templates = getTemplates(options as any, getDefaultConfig(options.tailwindPrefix), undefined, (...paths: string[]) => join(dist, ...paths), vue)
  for (const filename of ['ui.css', 'ui.base.css']) {
    writeFileSync(join(app, filename), await templates.find(template => template.filename === filename)!.getContents!({} as any))
  }

  const { compile } = await load('@tailwindcss/node')
  const { Scanner } = await load('@tailwindcss/oxide')
  const tailwind = overrides.tailwindPrefix ? `@import "tailwindcss" prefix(${overrides.tailwindPrefix});` : '@import "tailwindcss";'
  const compiler = await compile(`${tailwind}\n${before}\n@import "${join(dist, 'runtime/css/index.css')}";\n${css}`, {
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
  // The plugin's own alias rule, told apart from the defaults by the value it sets
  const aliasRule = (css: string, selector: string, declaration: string) => [...css.matchAll(new RegExp(`${selector.replace(/[().]/g, '\\$&')} \\{([^}]*)\\}`, 'g'))]
    .map(match => match[1]!)
    .find(body => body.includes(declaration)) ?? ''

  it('gives each alias its default palette at zero specificity, without the plugin', async () => {
    const css = await build({})
    const defaults = rule(css, ':where(:root, :host)')

    expect(defaults).toContain(`--ui-color-primary-500: var(--color-green-500, ${colors.green[500]});`)
    expect(defaults).toContain(`--ui-color-neutral-950: var(--color-slate-950, ${colors.slate[950]});`)
    // Tailwind outputs the palettes the defaults read
    expect(css).toContain(`--color-green-500: ${colors.green[500]};`)
  })

  it('falls back to the palette values when you reset the colors before the import', async () => {
    const css = await build({}, undefined, '', '@theme { --color-*: initial; }')

    expect(rule(css, ':where(:root, :host)')).toContain(`--ui-color-primary-500: var(--color-green-500, ${colors.green[500]});`)
    expect(css).not.toContain(`--color-green-500: ${colors.green[500]};`)
    // Nuxt UI's own tokens come after the reset, so their utilities stay
    expect(css).toContain('background-color: var(--ui-accent)')
  })

  it('follows a palette you override in `@theme`', async () => {
    const css = await build({}, undefined, '@theme static { --color-green-500: #00C16A; }')

    expect(css).toContain('--color-green-500: #00C16A;')
    expect(rule(css, ':where(:root, :host)')).toContain('--ui-color-primary-500: var(--color-green-500,')
  })

  it('points the aliases you pass at their palette', async () => {
    const css = await build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: indigo; neutral: neutral; }')
    const set = rule(css, ':root, :host')

    expect(set).toContain(`--ui-color-primary-500: ${colors.indigo[500]};`)
    // Tailwind's own neutral palette, which the `neutral` alias takes over
    expect(set).toContain(`--ui-color-neutral-500: ${colors.neutral[500]};`)
    expect(set).not.toContain('--ui-color-secondary')
  })

  it('points an alias at the shades you pick, for light and dark mode', async () => {
    const css = await build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: neutral 900 200; secondary: "indigo" 600; }')

    expect(rule(css, ':root, :host')).toContain(`--ui-color-secondary-500: ${colors.indigo[500]};`)
    expect(aliasRule(css, ':root, :host, .light', '--ui-primary: var(--ui-color-primary-900);')).toContain('--ui-secondary: var(--ui-color-secondary-600);')
    expect(aliasRule(css, '.dark', '--ui-primary: var(--ui-color-primary-200);')).toContain('--ui-secondary: var(--ui-color-secondary-600);')
  })

  it('resolves the palette with a Tailwind prefix', async () => {
    const css = await build({ tailwindPrefix: 'tw' }, undefined, '@plugin "@nuxt/ui/colors" { primary: indigo; }')

    expect(rule(css, ':root, :host')).toContain(`--ui-color-primary-500: ${colors.indigo[500]};`)
  })

  it('rejects an alias outside the set, a missing palette, another alias and a wrong shade', async () => {
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { tertiary: indigo; }')).rejects.toThrow('`tertiary` isn\'t a color alias')
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: brand; }')).rejects.toThrow('`primary: brand` needs the name of a Tailwind palette')
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: primary; }')).rejects.toThrow('`primary: primary` points a color alias at another')
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { primary: indigo 550; }')).rejects.toThrow('`primary: indigo 550` takes a palette and up to two shades')
    await expect(build({}, undefined, '@plugin "@nuxt/ui/colors" { neutral: zinc 900; }')).rejects.toThrow('`neutral: zinc 900` takes no shades')
  })
})
