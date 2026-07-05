import { describe, it, expect } from 'vitest'
import {
  createThemeDoc,
  isDefaultTheme,
  generateCSS,
  generateConfig,
  docToSettings,
  resolveToken,
  resolveTokens,
  presets
} from '../../docs/app/utils/theme-engine'
import type { ThemeDoc } from '../../docs/app/utils/theme-engine'
import colors from 'tailwindcss/colors'

describe('theme-engine', () => {
  describe('isDefaultTheme', () => {
    it('treats an empty doc as default', () => {
      expect(isDefaultTheme(createThemeDoc())).toBe(true)
    })

    it('treats any override as non-default', () => {
      expect(isDefaultTheme({ version: 1, radius: 0 })).toBe(false)
      expect(isDefaultTheme({ version: 1, colors: { primary: 'indigo' } })).toBe(false)
      expect(isDefaultTheme({ version: 1, blackAsPrimary: true })).toBe(false)
    })
  })

  describe('generateCSS', () => {
    it('emits only the imports for a default doc', () => {
      expect(generateCSS(createThemeDoc())).toBe('@import "tailwindcss";\n@import "@nuxt/ui";')
    })

    it('emits only what the doc overrides', () => {
      const doc: ThemeDoc = {
        version: 1,
        blackAsPrimary: true,
        radius: 0,
        font: { sans: 'Geist' },
        tokens: {
          light: { '--ui-bg': 'var(--ui-color-neutral-50)' },
          dark: { '--ui-bg': 'var(--ui-color-neutral-950)' }
        }
      }

      expect(generateCSS(doc)).toBe([
        '@import "tailwindcss";',
        '@import "@nuxt/ui";',
        '',
        '@theme {',
        `  --font-sans: 'Geist', sans-serif;`,
        '}',
        '',
        ':root {',
        '  --ui-radius: 0rem;',
        '  --ui-primary: black;',
        '}',
        '',
        ':root, .light {',
        '  --ui-bg: var(--ui-color-neutral-50);',
        '}',
        '',
        '.dark {',
        '  --ui-primary: white;',
        '  --ui-bg: var(--ui-color-neutral-950);',
        '}'
      ].join('\n'))
    })

    it('does not emit values matching the defaults', () => {
      const css = generateCSS({ version: 1, radius: 0.25, font: { sans: 'Public Sans' } })

      expect(css).not.toContain('--ui-radius')
      expect(css).not.toContain('--font-sans')
    })

    it('emits custom palettes as @theme static shades', () => {
      const css = generateCSS({
        version: 1,
        palettes: { clay: { shades: { 500: '#CC785C' } } }
      })

      expect(css).toContain('@theme static {')
      expect(css).toContain('  --color-clay-500: #CC785C;')
    })
  })

  describe('generateConfig', () => {
    it('emits an empty app config for a default doc', () => {
      expect(generateConfig(createThemeDoc())).toBe('export default defineAppConfig({})')
    })

    it('only includes color aliases that differ from the defaults', () => {
      const config = generateConfig({
        version: 1,
        colors: { primary: 'indigo', neutral: 'slate', success: 'green' }
      })

      expect(config).toContain(`primary: 'indigo'`)
      expect(config).not.toContain('neutral')
      expect(config).not.toContain('success')
    })

    it('includes component overrides under ui', () => {
      const config = generateConfig({
        version: 1,
        components: { button: { slots: { base: 'rounded-full' } } }
      })

      expect(config).toContain('button')
      expect(config).toContain(`base: 'rounded-full'`)
    })

    it('wraps the config in a vite plugin for vue', () => {
      const config = generateConfig({ version: 1, colors: { primary: 'indigo' } }, 'vue')

      expect(config).toContain(`import ui from '@nuxt/ui/vite'`)
      expect(config).toContain(`primary: 'indigo'`)
    })
  })

  describe('docToSettings', () => {
    it('maps the doc onto the applyThemeSettings shape', () => {
      const settings = docToSettings({
        version: 1,
        colors: { primary: 'signal', neutral: 'ink' },
        palettes: { signal: { shades: { 500: '#1DB954' } } },
        radius: 0.5,
        font: { sans: 'DM Sans' },
        tokens: { dark: { '--ui-bg': 'var(--ui-color-neutral-950)' } },
        components: { button: { slots: { base: 'rounded-full' } } }
      })

      expect(settings).toEqual({
        primary: 'signal',
        neutral: 'ink',
        radius: 0.5,
        font: 'DM Sans',
        customColors: { signal: { 500: '#1DB954' } },
        cssVariables: { dark: { '--ui-bg': 'var(--ui-color-neutral-950)' } },
        ui: { button: { slots: { base: 'rounded-full' } } }
      })
    })
  })

  describe('resolveToken', () => {
    it('resolves a default token through the alias chain with provenance', () => {
      const resolved = resolveToken(createThemeDoc(), 'light', '--ui-border')

      expect(resolved.source).toBe('default')
      expect(resolved.chain).toEqual(['--ui-border', '--ui-color-neutral-200', '--color-slate-200', colors.slate[200]])
      expect(resolved.value).toBe(colors.slate[200])
    })

    it('follows alias remaps into custom palettes', () => {
      const doc: ThemeDoc = {
        version: 1,
        colors: { neutral: 'ink' },
        palettes: { ink: { shades: { 200: '#DEDEDE' } } }
      }

      const resolved = resolveToken(doc, 'light', '--ui-border')

      expect(resolved.chain).toEqual(['--ui-border', '--ui-color-neutral-200', '--color-ink-200', '#DEDEDE'])
      expect(resolved.value).toBe('#DEDEDE')
    })

    it('marks token overrides and resolves their new target', () => {
      const doc: ThemeDoc = {
        version: 1,
        tokens: { dark: { '--ui-bg': 'var(--ui-color-neutral-950)' } }
      }

      const resolved = resolveToken(doc, 'dark', '--ui-bg')

      expect(resolved.source).toBe('override')
      expect(resolved.chain).toEqual(['--ui-bg', '--ui-color-neutral-950', '--color-slate-950', colors.slate[950]])
    })

    it('keeps literals as-is', () => {
      const resolved = resolveToken(createThemeDoc(), 'light', '--ui-bg')

      expect(resolved.value).toBe('white')
      expect(resolved.chain).toEqual(['--ui-bg', 'white'])
    })
  })

  describe('presets', () => {
    it.each(presets.map(preset => [preset.id, preset] as const))('%s generates valid exports', (_id, preset) => {
      const css = generateCSS(preset.doc)
      const config = generateConfig(preset.doc)

      expect(css).toContain('@import "@nuxt/ui";')
      expect(config).toContain('export default defineAppConfig(')
    })

    it('nuxt-ui preset is the default theme', () => {
      expect(isDefaultTheme(presets.find(preset => preset.id === 'nuxt-ui')!.doc)).toBe(true)
    })

    it('every token override in presets resolves to a color', () => {
      for (const preset of presets) {
        for (const mode of ['light', 'dark'] as const) {
          const resolved = resolveTokens(preset.doc, mode)
          for (const token of Object.keys(preset.doc.tokens?.[mode] || {})) {
            expect(resolved[token]!.value, `${preset.id} ${mode} ${token}`).toMatch(/^#|^oklch\(|^white$|^black$/)
          }
        }
      }
    })
  })
})

describe('styleComponents', () => {
  it('returns nothing for the default treatment', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    expect(styleComponents({})).toEqual({})
    expect(styleComponents({ shadow: 'none', border: 'default' })).toEqual({})
  })

  it('merges shadow and border fragments slot-wise', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const components = styleComponents({ shadow: 'hard', border: 'bold' })

    expect(components.button!.slots!.base).toContain('shadow-[var(--ui-shadow-offset-x)_var(--ui-shadow-offset-y)_var(--ui-shadow-blur)_var(--ui-shadow-spread)_var(--ui-shadow-final-hard)]')
    // bold only thickens existing rings: buttons gain no base ring, the
    // outline/subtle compound overrides carry width only
    expect(components.button!.slots!.base).not.toContain('ring')
    expect(components.button!.compoundVariants).toContainEqual({ variant: 'outline', class: 'ring-2' })
    // card rings live at variant level, so bold ships compounds, not slots
    expect(components.card!.slots?.root ?? '').toContain('var(--ui-shadow-final-hard)]')
    expect(components.card!.compoundVariants).toContainEqual({ variant: 'outline', class: { root: 'ring-2' } })
  })

  it('docToSettings keeps style out of the ui channel but carries its tokens', async () => {
    const { docToSettings } = await import('../../docs/app/utils/theme-engine')
    const settings = docToSettings({
      version: 1,
      style: { shadow: 'hard', shadowColor: 'black' },
      components: { button: { slots: { base: 'rounded-full' } } }
    })

    // components ride settings.ui; the style class bundle goes through the
    // dedicated style-ui channel applied by the caller, so a later style
    // change can never destroy doc components.
    expect(settings.ui).toEqual({ button: { slots: { base: 'rounded-full' } } })
    expect(settings.cssVariables.light['--ui-shadow-color']).toBe('black')
  })

  it('mergeUi concatenates slot classes and compound variants', async () => {
    const { mergeUi, styleComponents } = await import('../../docs/app/utils/theme-engine')
    const merged = mergeUi(styleComponents({ shadow: 'hard' }), { button: { slots: { base: 'rounded-full' } } })

    // both the shadow classes and the explicit override survive, explicit last
    expect(merged.button.slots.base).toContain('var(--ui-shadow-final-hard)]')
    expect(merged.button.slots.base.endsWith('rounded-full')).toBe(true)
    expect(merged.card.slots.root).toContain('var(--ui-shadow-final-hard)]')
  })
})

describe('style colors', () => {
  it('frame adds outlines to solid/soft but never ghost', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const components = styleComponents({ border: 'frame' })

    expect(components.button!.compoundVariants).toContainEqual({ variant: 'solid', class: 'ring-2 ring-inset ring-(--ui-border-accented)' })
    expect(JSON.stringify(components.button!.compoundVariants)).not.toContain('"ghost"')
  })

  it('borderColor appends recolor compounds after width ones', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const compounds = styleComponents({ border: 'bold', borderColor: 'black' }).button!.compoundVariants!

    const widthIndex = compounds.findIndex(entry => entry.class === 'ring-2')
    const colorIndex = compounds.findIndex(entry => entry.class === 'ring-(--ui-frame-color)')
    expect(widthIndex).toBeGreaterThanOrEqual(0)
    expect(colorIndex).toBeGreaterThan(widthIndex)
  })

  it('styleTokens maps color choices per mode and default contributes nothing', async () => {
    const { styleTokens } = await import('../../docs/app/utils/theme-engine')

    expect(styleTokens({})).toEqual({ light: {}, dark: {} })
    expect(styleTokens({ borderColor: 'inverted', shadowColor: 'black' })).toEqual({
      light: { '--ui-frame-color': 'var(--ui-color-neutral-950)', '--ui-shadow-color': 'black' },
      dark: { '--ui-frame-color': 'white', '--ui-shadow-color': 'black' }
    })
  })

  it('styleTokens supports per-mode neutral shades', async () => {
    const { styleTokens } = await import('../../docs/app/utils/theme-engine')

    expect(styleTokens({ shadowColor: 'shade', shadowShade: { light: 700, dark: 300 } })).toEqual({
      light: { '--ui-shadow-color': 'var(--ui-color-neutral-700)' },
      dark: { '--ui-shadow-color': 'var(--ui-color-neutral-300)' }
    })
    // defaults apply when shades are unset
    expect(styleTokens({ shadowColor: 'shade' }).dark['--ui-shadow-color']).toBe('var(--ui-color-neutral-800)')
  })

  it('styleTokens maps token shades per mode, only for modes present', async () => {
    const { styleTokens } = await import('../../docs/app/utils/theme-engine')

    expect(styleTokens({ tokenShades: { '--ui-text-muted': { light: 600, dark: 300 } } })).toEqual({
      light: { '--ui-text-muted': 'var(--ui-color-neutral-600)' },
      dark: { '--ui-text-muted': 'var(--ui-color-neutral-300)' }
    })
    // a dark-only entry must NOT invent a light override (preset hydration)
    expect(styleTokens({ tokenShades: { '--ui-bg': { dark: 950 } } })).toEqual({
      light: {},
      dark: { '--ui-bg': 'var(--ui-color-neutral-950)' }
    })
    // non-whitelisted tokens are ignored
    expect(styleTokens({ tokenShades: { '--ui-evil': { light: 50, dark: 50 } } })).toEqual({ light: {}, dark: {} })
  })

  it('expands app-wide defaults only where the component supports them', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const components = styleComponents({ defaults: { variant: 'solid', size: 'lg' } })

    expect(components.button!.defaultVariants).toEqual({ variant: 'solid', size: 'lg' })
    expect(components.card!.defaultVariants).toEqual({ variant: 'solid' })
    // inputs have no solid variant: size applies, variant stays default
    expect(components.input!.defaultVariants).toEqual({ size: 'lg' })
    // subtle IS supported by inputs
    expect(styleComponents({ defaults: { variant: 'subtle' } }).input!.defaultVariants).toEqual({ variant: 'subtle' })
  })

  it('emits hard-shadow geometry variables and keeps defaultVariants replace semantics', async () => {
    const { styleTokens, mergeUi } = await import('../../docs/app/utils/theme-engine')

    const tokens = styleTokens({ shadow: 'hard', shadowGeometry: { x: 6, blur: 4 } })
    expect(tokens.light['--ui-shadow-offset-x']).toBe('6px')
    expect(tokens.light['--ui-shadow-offset-y']).toBe('3px')
    expect(tokens.light['--ui-shadow-blur']).toBe('4px')
    // geometry is meaningless without hard shadows
    expect(styleTokens({ shadowGeometry: { x: 6 } }).light).toEqual({})

    // defaultVariants merge by replacement, not class concatenation
    const merged = mergeUi(
      { button: { defaultVariants: { variant: 'solid', size: 'md' } } },
      { button: { defaultVariants: { variant: 'subtle' } } }
    )
    expect(merged.button.defaultVariants).toEqual({ variant: 'subtle', size: 'md' })
  })

  it('styleTokens supports per-mode border shades', async () => {
    const { styleTokens } = await import('../../docs/app/utils/theme-engine')

    expect(styleTokens({ borderColor: 'shade', borderShade: { light: 700, dark: 100 } })).toEqual({
      light: { '--ui-frame-color': 'var(--ui-color-neutral-700)' },
      dark: { '--ui-frame-color': 'var(--ui-color-neutral-100)' }
    })
    expect(styleTokens({ borderColor: 'shade' }).dark['--ui-frame-color']).toBe('var(--ui-color-neutral-200)')
  })

  it('generateCSS emits style color variables', async () => {
    const { generateCSS } = await import('../../docs/app/utils/theme-engine')
    const css = generateCSS({ version: 1, style: { shadow: 'hard', border: 'frame', borderColor: 'inverted' } })

    expect(css).toContain('--ui-frame-color: var(--ui-color-neutral-950);')
    expect(css).toContain('--ui-shadow-color: var(--ui-color-neutral-950);')
    expect(css).toContain('--ui-shadow-color: black;')
  })
})
