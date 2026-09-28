import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { join } from 'pathe'
import { getTemplates } from '../../src/templates'
import { defaultOptions, getDefaultConfig } from '../../src/utils/defaults'
import tailwindColors from 'tailwindcss/colors'
import { colors } from '../../src/runtime/theme/color'

const resolve = (...paths: string[]) => join(process.cwd(), 'src', ...paths)
const themeDir = resolve('./runtime/theme')

function themeContents(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }) {
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

  it('generates only the sources', async () => {
    const contents = themeContents({ tailwindPrefix: 'tw' })

    expect(await contents('ui.css')).not.toContain('@layer')
    expect(await contents('ui.css')).not.toContain('--ui-accent-')
    expect(await themeContents({})('ui.base.css')).toBe('')
  })

  it('repeats the color scopes for the prefixed class in the base layer', async () => {
    const css = await themeContents({ tailwindPrefix: 'tw' })('ui.base.css')

    expect(css).toMatch(/^@layer base \{\n {2}\.tw\\:\\\[--ui-accent\\:var\\\(--ui-primary\\\)\\\] \{/)
    expect(css).toContain('.tw\\:\\[--ui-accent\\:var\\(--ui-warning\\)\\] {\n    --ui-accent-foreground: var(--ui-warning-foreground);')
    expect(css).toContain('.tw\\:\\[--ui-accent\\:var\\(--ui-neutral\\)\\] {\n    --ui-neutral: var(--ui-bg-inverted);')
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
describe('static css', () => {
  const tokens = readFileSync(resolve('./runtime/tokens.css'), 'utf8')
  const accent = readFileSync(resolve('./runtime/accent.css'), 'utf8')

  // `#build/ui.base.css` adds the prefixed scopes after `accent.css`, so the
  // reset, which also matches a prefixed scope class, must not outrank them
  it('resets the accent roles at zero specificity', () => {
    expect(accent).toContain(':where([class*="[--ui-accent:"]) {')
  })

  // The fallbacks hold Tailwind's palette for a prefixed app, so they follow its version
  it.each(Object.entries({ primary: 'green', secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red', neutral: 'slate' }))('defaults %s to %s', (alias, palette) => {
    const base = readFileSync(resolve('./runtime/base.css'), 'utf8')
    for (const [shade, value] of Object.entries((tailwindColors as any)[palette])) {
      expect(base).toContain(`--ui-color-${alias}-${shade}: var(--color-${palette}-${shade}, ${value});`)
    }
  })

  it.each(colors)('bridges and scopes %s', (color) => {
    expect(tokens).toContain(`--color-${color}: var(--ui-${color});`)
    expect(tokens).toContain(`--color-${color}-500: var(--ui-color-${color}-500);`)
    expect(accent).toContain(`.\\[--ui-accent\\:var\\(--ui-${color}\\)\\] {`)
    expect(accent).toContain(`--ui-accent-foreground: var(--ui-${color}-foreground`)
  })
})
