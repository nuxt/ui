import { describe, it, expect } from 'vitest'
import { getTemplates } from '../../src/templates'
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
})
