import { describe, it, expect } from 'vitest'
import { join } from 'pathe'
import { getTemplates } from '../../src/templates'
import { defaultOptions, getDefaultConfig } from '../../src/utils/defaults'

const resolve = (...paths: string[]) => join(process.cwd(), 'src', ...paths)
const themeDir = resolve('./runtime/theme')

function themeContents(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }) {
  const options = { ...defaultOptions, ...overrides, theme: { ...defaultOptions.theme, ...(overrides.theme || {}) } }
  const templates = getTemplates(options as any, getDefaultConfig(options.theme), undefined, resolve, vue)
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
    const css = await themeContents({ experimental: { componentDetection: true } }, { detectedComponents: new Set(['Select']) })('ui.css')
    const classes = inlineClasses(css)

    expect(css).toContain(`@source not "${themeDir}";`)
    expect(classes).toContain('origin-(--reka-select-content-transform-origin)')
    expect(classes).toContain('dark:disabled:bg-transparent')
    expect(classes).not.toContain('animate-pulse')
  })

  it('points each color scope at its own role variables, with the prefix', async () => {
    const css = await themeContents({ theme: { prefix: 'tw' } })('ui.css')

    expect(css).toContain('[class*="[--ui-accent:"]')
    expect(css).toContain('[class~="tw:[--ui-accent:var(--ui-warning)]"] {\n    --ui-accent-foreground: var(--ui-warning-foreground);')
    expect(css).toContain('[class~="tw:[--ui-accent:var(--ui-neutral)]"] {\n    --ui-neutral: var(--ui-bg-inverted);')
  })

  it('lists the prefixed classes inline with the prefix', async () => {
    const css = await themeContents({ theme: { prefix: 'tw' } })('ui.css')

    expect(css).toContain(`@source not "${themeDir}";`)
    expect(inlineClasses(css)).toContain('tw:rounded-md')
  })

  it('lists only the detected components\' classes with the prefix', async () => {
    const css = await themeContents({ theme: { prefix: 'tw' }, experimental: { componentDetection: true } }, { detectedComponents: new Set(['Button']) })('ui.css')
    const classes = inlineClasses(css)

    expect(classes).toContain('tw:rounded-md')
    expect(classes).not.toContain('tw:min-w-full')
  })
})
