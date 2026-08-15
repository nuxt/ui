import { describe, it, expect } from 'vitest'
import {
  importTheme,
  generateCSS,
  generateConfig,
  styleTokens,
  presets,
  DEFAULT_COLORS
} from '../../docs/app/utils/theme/engine'
import type { ThemeDoc } from '../../docs/app/utils/theme/engine'

/**
 * The merged per-mode variable maps a doc produces, the semantic ground
 * truth for CSS round-trips. Import may move a var between the style axis
 * and plain tokens (both render identically), so docs are compared here,
 * not field-by-field.
 */
function effectiveVars(doc: ThemeDoc) {
  const style = styleTokens(doc.style || {})
  return {
    light: { ...style.light, ...doc.tokens?.light },
    dark: { ...style.dark, ...doc.tokens?.dark }
  }
}

describe('importTheme', () => {
  describe.each(presets.map(preset => [preset.id, preset.doc] as const))('round-trips preset %s', (_id, original) => {
    const css = generateCSS(original)
    const config = generateConfig(original)
    const { doc: imported, skipped } = importTheme({ css, config })

    it('understands every line of its own export', () => {
      expect(skipped).toEqual([])
    })

    it('reproduces the config exactly', () => {
      expect(generateConfig(imported)).toBe(config)
    })

    it('reproduces the effective CSS variables', () => {
      expect(effectiveVars(imported)).toEqual(effectiveVars(original))
      // Aliases set to their defaults are no-ops the export rightly drops,
      // compare the choices that actually change anything.
      const overrides = (doc: ThemeDoc) => Object.fromEntries(
        Object.entries(doc.colors ?? {}).filter(([alias, name]) => DEFAULT_COLORS[alias as keyof typeof DEFAULT_COLORS] !== name)
      )
      expect(imported.palettes ?? {}).toEqual(original.palettes ?? {})
      expect(overrides(imported)).toEqual(overrides(original))
      expect(imported.radius).toBe(original.radius)
      expect(imported.font?.sans).toBe(original.font?.sans)
      expect(imported.fontSize).toBe(original.fontSize)
      expect(imported.spacing).toBe(original.spacing)
      expect(!!imported.blackAsPrimary).toBe(!!original.blackAsPrimary)
      expect(imported.style?.shadow).toBe(original.style?.shadow)
      expect(imported.style?.border ?? 'default').toBe(original.style?.border ?? 'default')
    })

    it('is a fixed point of export → import', () => {
      const reexportedCSS = generateCSS(imported)
      const reexportedConfig = generateConfig(imported)
      const second = importTheme({ css: reexportedCSS, config: reexportedConfig })

      expect(second.skipped).toEqual([])
      expect(generateCSS(second.doc)).toBe(reexportedCSS)
      expect(generateConfig(second.doc)).toBe(reexportedConfig)
    })
  })

  it('round-trips white/black ladder stops in shades and token shades', () => {
    const original: ThemeDoc = {
      version: 1,
      style: {
        shadow: 'custom',
        shadowColor: 'shade',
        // literal ladder ends mixed with a ramp stop (NOT the stock
        // 950/black pair, which the importer rightly reads as no-choice)
        shadowShade: { light: 900, dark: 'black' },
        tokenShades: { '--ui-bg': { light: 'white' } }
      }
    }
    const css = generateCSS(original)
    expect(css).toContain('--ui-shadow-color: black')
    expect(css).toContain('--ui-bg: white')

    const { doc: imported, skipped } = importTheme({ css, config: generateConfig(original) })
    expect(skipped).toEqual([])
    // the literals survive semantically (representation may re-slot between
    // the style axis and plain tokens) and the round-trip reaches a fixed point
    expect(effectiveVars(imported)).toEqual(effectiveVars(original))
    const second = importTheme({ css: generateCSS(imported), config: generateConfig(imported) })
    expect(second.skipped).toEqual([])
    expect(generateCSS(second.doc)).toBe(generateCSS(imported))
  })

  it('round-trips an inner-shadow style', () => {
    const original: ThemeDoc = {
      version: 1,
      style: { innerShadow: 'custom', innerShadowGeometry: { x: 0, y: 4, blur: 8, spread: 0 }, innerShadowOpacity: 30, innerShadowColor: 'primary-shade', innerShadowShade: { light: 700, dark: 300 } }
    }
    const css = generateCSS(original)
    const config = generateConfig(original)
    const { doc: imported, skipped } = importTheme({ css, config })

    expect(skipped).toEqual([])
    expect(imported.style?.innerShadow).toBe('custom')
    expect(imported.style?.innerShadowGeometry).toEqual({ x: 0, y: 4, blur: 8, spread: 0 })
    expect(imported.style?.innerShadowOpacity).toBe(30)
    expect(imported.style?.innerShadowColor).toBe('primary-shade')
    expect(imported.style?.innerShadowShade).toEqual({ light: 700, dark: 300 })
    expect(generateConfig(imported)).toBe(config)
    expect(generateCSS(imported)).toBe(css)
  })

  it('parses sizing, font and radius from CSS alone', () => {
    const { doc, skipped } = importTheme({
      css: [
        '@import "tailwindcss";',
        '@import "@nuxt/ui";',
        '',
        '@theme {',
        '  --font-sans: \'DM Sans\', sans-serif;',
        '  --spacing: 0.3rem;',
        '}',
        '',
        'html {',
        '  font-size: 15px;',
        '}',
        '',
        ':root {',
        '  --ui-radius: 0.5rem;',
        '}'
      ].join('\n')
    })

    expect(skipped).toEqual([])
    expect(doc.font?.sans).toBe('DM Sans')
    expect(doc.spacing).toBe(0.3)
    expect(doc.fontSize).toBe(15)
    expect(doc.radius).toBe(0.5)
  })

  it('accepts hex palettes and reports unknown lines instead of dropping them', () => {
    const { doc, skipped } = importTheme({
      css: [
        '@theme static {',
        '  --color-brand-500: #CC785C;',
        '}',
        '',
        '.made-up-selector {',
        '  color: red;',
        '}'
      ].join('\n')
    })

    expect(doc.palettes).toEqual({ brand: { shades: { 500: '#CC785C' } } })
    expect(skipped).toEqual(['.made-up-selector { color: red }'])
  })

  it('keeps style variables it cannot express as plain tokens', () => {
    const { doc, skipped } = importTheme({
      css: [
        ':root, .light {',
        '  --ui-border-color: #ff0000;',
        '}',
        '',
        '.dark {',
        '  --ui-border-color: #ff0000;',
        '}'
      ].join('\n')
    })

    // A literal the border-color table can't name is not a style choice,
    // but it must survive somewhere, not silently vanish.
    expect(skipped).toEqual([])
    expect(doc.style?.borderColor).toBeUndefined()
    expect(doc.tokens?.light?.['--ui-border-color']).toBe('#ff0000')
    expect(doc.tokens?.dark?.['--ui-border-color']).toBe('#ff0000')
  })

  it('round-trips base weight and heading typography', () => {
    const original: ThemeDoc = {
      version: 1,
      font: { sans: 'Comic Neue', weights: { normal: 450, medium: 550, semibold: 650 }, uppercase: true, italic: true, letterSpacing: 0.05, lineHeight: 1.6, heading: { font: 'Outfit', weight: 800, uppercase: true, italic: true, underline: true, letterSpacing: -0.02, lineHeight: 1.2 } }
    }
    const css = generateCSS(original)
    const { doc: imported, skipped } = importTheme({ css })

    expect(skipped).toEqual([])
    expect(imported.font).toEqual(original.font)
    expect(generateCSS(imported)).toBe(css)
  })

  it('round-trips the flat shadow treatment without color defaults', () => {
    const original: ThemeDoc = { version: 1, style: { shadow: 'flat' } }
    const css = generateCSS(original)
    const config = generateConfig(original)
    const { doc: imported, skipped } = importTheme({ css, config })

    // flat strips shadows, no shadow color belongs in its export
    expect(css).not.toContain('--ui-shadow-color')
    expect(skipped).toEqual([])
    expect(imported.style?.shadow).toBe('flat')
    expect(generateConfig(imported)).toBe(config)
    expect(generateCSS(imported)).toBe(css)
  })

  it('round-trips the app-wide default size across every sized component', () => {
    const original: ThemeDoc = { version: 1, style: { defaults: { size: 'lg' } } }
    const config = generateConfig(original)
    const { doc: imported, skipped } = importTheme({ config })

    expect(skipped).toEqual([])
    expect(imported.style?.defaults?.size).toBe('lg')
    expect(imported.components).toBeUndefined()
    expect(generateConfig(imported)).toBe(config)
  })

  it('round-trips per-group default colors', () => {
    const doc: ThemeDoc = {
      version: 1,
      style: {
        defaults: { variants: { buttons: 'soft' }, colors: { buttons: 'secondary', inputs: 'neutral' } }
      }
    }
    const { doc: imported } = importTheme({ config: generateConfig(doc) })
    expect(imported.style?.defaults).toEqual(doc.style!.defaults)
  })

  it('reads colors and defaults from a config alone', () => {
    const { doc, skipped } = importTheme({
      config: [
        'export default defineAppConfig({',
        '  ui: {',
        '    colors: {',
        '      primary: \'indigo\',',
        '      neutral: \'zinc\'',
        '    },',
        '    button: {',
        '      defaultVariants: {',
        '        variant: \'soft\'',
        '      }',
        '    },',
        '    badge: {',
        '      defaultVariants: {',
        '        variant: \'soft\'',
        '      }',
        '    }',
        '  }',
        '})'
      ].join('\n')
    })

    expect(skipped).toEqual([])
    expect(doc.colors).toEqual({ primary: 'indigo', neutral: 'zinc' })
    expect(doc.style?.defaults?.variants).toEqual({ buttons: 'soft' })
    expect(doc.components).toBeUndefined()
  })

  it('keeps genuine width classes in config-only pastes', () => {
    // The legacy ring-N scrubber must only run when legacy tokens were
    // actually detected, not eat a user's own border-2 out of a paste.
    const { doc } = importTheme({
      config: 'export default defineAppConfig({ ui: { card: { slots: { root: \'border-2 border-dashed\' } } } })'
    })

    expect(doc.components?.card?.slots).toEqual({ root: 'border-2 border-dashed' })
  })

  it('round-trips a default-width custom border with frame', () => {
    const original: ThemeDoc = { version: 1, style: { border: 'custom', borderWidth: 1, frame: true } }
    const css = generateCSS(original)
    const config = generateConfig(original)
    const { doc: imported, skipped } = importTheme({ css, config })

    expect(skipped).toEqual([])
    // width 1 elides the @theme width channel, so the frame literals come
    // back as explicit components, the re-export must still be identical.
    expect(generateCSS(imported)).toBe(css)
    expect(generateConfig(imported)).toBe(config)
  })

  it('skips plain declarations under token selectors instead of importing them', () => {
    const { doc, skipped } = importTheme({
      css: ':root, .light {\n  background: red;\n  --ui-bg: black;\n}'
    })

    expect(doc.tokens?.light?.['--ui-bg']).toBe('black')
    expect(skipped).toEqual([':root, .light { background: red }'])
  })

  it('skips nested at-rule blocks instead of importing them as global', () => {
    const { doc, skipped } = importTheme({
      css: '@media (prefers-color-scheme: dark) {\n  :root {\n    --ui-radius: 2rem;\n  }\n}'
    })

    expect(doc.radius).toBeUndefined()
    expect(skipped).toEqual(['@media (prefers-color-scheme: dark) { :root { --ui-radius: 2rem; } }'])
  })

  it('keeps explicit component overrides that no style expansion explains', () => {
    const { doc } = importTheme({
      config: 'export default defineAppConfig({ ui: { button: { slots: { base: \'rounded-full\' } } } })'
    })

    expect(doc.components).toEqual({ button: { slots: { base: 'rounded-full' } } })
    expect(doc.style).toBeUndefined()
  })
})
