import { describe, it, expect } from 'vitest'
import { getTemplates } from '../../src/templates'
import { defaultOptions, getDefaultConfig } from '../../src/utils/defaults'

function themeContents(overrides: Record<string, any>, vue?: { detectedComponents?: Set<string> }) {
  const options = { ...defaultOptions, ...overrides, theme: { ...defaultOptions.theme, ...(overrides.theme || {}) } }
  const templates = getTemplates(options as any, getDefaultConfig(options.theme), undefined, undefined, vue)
  return (filename: string) => templates.find(template => template.filename === filename)!.getContents!({} as any)
}

// `skeleton` is a single-element theme, one `base` slot. The detection blanking
// goes through `applyUnstyled`, so this asserts on the emitted theme contents,
// not on the detected component list.
describe('theme templates', () => {
  it('blanks single-element themes for undetected components', async () => {
    const contents = themeContents({ experimental: { componentDetection: true } }, { detectedComponents: new Set(['Button']) })

    expect(await contents('ui/skeleton.ts')).not.toContain('animate-pulse')
    expect(await contents('ui/table.ts')).not.toContain('min-w-full')
    expect(await contents('ui/button.ts')).toContain('rounded-md')
  })

  it('points each color scope at its own role variables, with the prefix', async () => {
    const css = await themeContents({ theme: { prefix: 'tw' } })('ui.css')

    expect(css).toContain('[class*="[--ui-accent:"]')
    expect(css).toContain('[class~="tw:[--ui-accent:var(--ui-warning)]"] {\n    --ui-accent-foreground: var(--ui-warning-foreground);')
    expect(css).toContain('[class~="tw:[--ui-accent:var(--ui-neutral)]"] {\n    --ui-neutral: var(--ui-bg-inverted);')
  })
})
