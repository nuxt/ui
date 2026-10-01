import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import ts from 'typescript'
import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import { getTemplates, prefixedClasses } from '../../src/templates'
import { defaultOptions, getDefaultConfig } from '../../src/utils/defaults'
import tailwindColors from 'tailwindcss/colors'
import { colors } from '../../src/runtime/theme/color'

const resolve = (...paths: string[]) => join(process.cwd(), 'src', ...paths)
const themeDir = resolve('./runtime/theme')

function themeContents(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string>, dev?: boolean }) {
  const options = { ...defaultOptions, ...overrides }
  const templates = getTemplates(options as any, getDefaultConfig(options.tailwindPrefix), undefined, resolve, vue)
  return (filename: string) => templates.find(template => template.filename === filename)!.getContents!({} as any)
}

function inlineClasses(css: string) {
  return css.match(/@source inline\("(.*)"\);/)?.[1]?.split(' ') ?? []
}

describe('theme templates', () => {
  it('re-exports the package themes from `#build/ui`', async () => {
    const contents = themeContents({ prose: true })

    expect(await contents('ui/button.ts')).toBe(`export { default } from "${themeDir}/button"\n`)
    expect(await contents('ui/prose/p.ts')).toBe(`export { default } from "${themeDir}/prose/p"\n`)
  })

  it('leaves the prose and content themes out when they are off', async () => {
    const css = await themeContents({})('ui.css')

    expect(css).toContain(`@source not "${themeDir}/prose";`)
    expect(css).toContain(`@source not "${themeDir}/content";`)
    expect(css).not.toContain('@source inline(')
  })

  // Select's theme extends Input's, so its file alone doesn't hold all its classes
  it('lists the detected components\' classes inline, the ones they extend included', async () => {
    const css = await themeContents({ componentDetection: true }, { detectedComponents: new Set(['Select']) })('ui.css')
    const classes = inlineClasses(css)

    expect(css).toContain(`@source not "${themeDir}";`)
    expect(classes).toContain('origin-(--reka-select-content-transform-origin)')
    expect(classes).toContain('dark:disabled:bg-transparent')
    expect(classes).not.toContain('animate-pulse')
  })

  // The inline list is computed once from the imported themes, so an edit to a
  // theme file would only reach the CSS after a restart
  it('scans the theme files in dev instead of listing the detected classes', async () => {
    const css = await themeContents({ componentDetection: true }, { detectedComponents: new Set(['Select']), dev: true })('ui.css')

    expect(css).not.toContain(`@source not "${themeDir}";`)
    expect(css).not.toContain('@source inline(')
    expect(css).toContain(`@source not "${themeDir}/prose";`)
    expect(css).toContain(`@source not "${themeDir}/content";`)
  })

  // Scanning the theme files only finds unprefixed candidates
  it('keeps the inline list in dev with the prefix', async () => {
    const css = await themeContents({ tailwindPrefix: 'tw', componentDetection: true }, { detectedComponents: new Set(['Button']), dev: true })('ui.css')
    const classes = inlineClasses(css)

    expect(css).toContain(`@source not "${themeDir}";`)
    expect(classes).toContain('tw:rounded-md')
    expect(classes).not.toContain('tw:min-w-full')
  })

  it('lists the detected themes in dev for the runtime warning', async () => {
    const contents = await themeContents({ componentDetection: true }, { detectedComponents: new Set(['Button', 'InputMenu']), dev: true })('ui/detected.ts')

    expect(contents).toContain('["button","inputMenu"]')
    expect(contents).toContain('import.meta.hot.accept(')
  })

  // A module that accepts its own update runs again, and its importers keep the
  // first version's export, so every version has to refill that same set
  it('refills the set components read on every detection update', async () => {
    const hot = { data: {} as Record<string, any>, accept: () => {} }
    const run = async (detectedComponents: Set<string>) => {
      const code = await themeContents({ componentDetection: true }, { detectedComponents, dev: true })('ui/detected.ts')
      const js = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext } }).outputText
      return new Function('hot', js.replaceAll('import.meta.hot', 'hot').replace('export default', 'return'))(hot) as Set<string>
    }

    const first = await run(new Set(['Button']))
    await run(new Set(['Button', 'Calendar']))
    await run(new Set(['Calendar']))

    expect([...first]).toEqual(['calendar'])
  })

  it('lists every theme in dev when nothing is detected', async () => {
    const contents = await themeContents({ componentDetection: true }, { dev: true })('ui/detected.ts')

    expect(contents).toContain('"button"')
    expect(contents).toContain('"dashboardSidebar"')
  })

  it('leaves the detected themes out of the build and without detection', async () => {
    const detectedComponents = new Set(['Button'])

    expect(await themeContents({ componentDetection: true }, { detectedComponents })('ui/detected.ts')).toBe('export default null as Set<string> | null\n')
    expect(await themeContents({ componentDetection: false }, { detectedComponents, dev: true })('ui/detected.ts')).toBe('export default null as Set<string> | null\n')
  })

  it('generates only the sources', async () => {
    const contents = themeContents({ tailwindPrefix: 'tw' })

    expect(await contents('ui.css')).not.toContain('@layer')
    expect(await contents('ui.css')).not.toContain('--ui-accent-')
    expect(await themeContents({})('ui.base.css')).toBe('')
  })

  it('repeats the color scopes for the prefixed class in the base layer', async () => {
    const css = await themeContents({ tailwindPrefix: 'tw' })('ui.base.css')

    expect(css).toMatch(/^@layer base \{\n {2}\.tw\\:\\\[--ui-accent\\:var\\\(--ui-primary\\\)\\\] \{/)
    expect(css).toContain('.tw\\:\\[--ui-accent\\:var\\(--ui-warning\\)\\] {\n    --ui-accent-bg-hover: var(--ui-warning-bg-hover);')
    expect(css).toContain('.tw\\:\\[--ui-accent\\:var\\(--ui-neutral\\)\\] {\n    --ui-accent-bg-hover: var(--ui-neutral-bg-hover,')
    expect(css).not.toContain('  .\\[--ui-accent')
    expect(css).not.toContain(':where(')
  })

  it('lists the prefixed classes inline with the prefix', async () => {
    const css = await themeContents({ tailwindPrefix: 'tw' })('ui.css')

    expect(css).toContain(`@source not "${themeDir}";`)
    expect(inlineClasses(css)).toContain('tw:rounded-md')
  })

  it('lists only the detected components\' classes with the prefix', async () => {
    const css = await themeContents({ tailwindPrefix: 'tw', componentDetection: true }, { detectedComponents: new Set(['Button']) })('ui.css')
    const classes = inlineClasses(css)

    expect(classes).toContain('tw:rounded-md')
    expect(classes).not.toContain('tw:min-w-full')
  })
})

// The tokens and color scopes are static CSS now, so they're checked against
// the color set the themes scope with.
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

  it('adds them to `ui.css` with `tailwindPrefix`', async () => {
    const css = await themeContents({ tailwindPrefix: 'tw' })('ui.css')

    expect(css).toContain(`@source inline("${prefixedClasses.map(cls => `tw:${cls}`).join(' ')}");`)
  })
})

describe('static css', () => {
  const tokens = readFileSync(resolve('./runtime/css/tokens.css'), 'utf8')
  const accent = readFileSync(resolve('./runtime/css/accent.css'), 'utf8')

  // `@nuxt/icon` inserts `@layer base` styles before the app's stylesheet, which
  // declares `base` below `theme`: a default palette in `theme` would then beat
  // the `@nuxt/ui/colors` output, which lands in `base`
  it('keeps the default palettes in the base layer', () => {
    const base = readFileSync(resolve('./runtime/css/base.css'), 'utf8')
    const before = base.slice(0, base.indexOf('--ui-color-primary-500:'))

    expect(before.lastIndexOf('@layer base {')).toBeGreaterThan(before.lastIndexOf('@layer theme {'))
  })

  // `#build/ui.base.css` adds the prefixed scopes after `accent.css`, so the
  // reset, which also matches a prefixed scope class, must not outrank them
  it('resets the accent roles at zero specificity', () => {
    expect(accent).toContain(':where([class*="[--ui-accent:"]) {')
  })

  // The fallbacks hold Tailwind's palette for a prefixed app, so they follow its version
  it.each(Object.entries({ primary: 'green', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red', neutral: 'slate' }))('defaults %s to %s', (alias, palette) => {
    const base = readFileSync(resolve('./runtime/css/base.css'), 'utf8')
    for (const [shade, value] of Object.entries((tailwindColors as any)[palette])) {
      expect(base).toContain(`--ui-color-${alias}-${shade}: var(--color-${palette}-${shade}, ${value});`)
    }
  })

  it.each(colors)('bridges and scopes %s', (color) => {
    expect(tokens).toContain(`--color-${color}: var(--ui-${color});`)
    expect(tokens).toContain(`--color-${color}-500: var(--ui-color-${color}-500);`)
    expect(accent).toContain(`.\\[--ui-accent\\:var\\(--ui-${color}\\)\\] {`)
    expect(accent).toContain(`--ui-accent-text-contrast: var(--ui-${color}-text-contrast`)
  })
})
