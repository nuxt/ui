import { describe, it, expect } from 'vitest'
import {
  createThemeDoc,
  isDefaultTheme,
  generateCSS,
  generateConfig,
  docToSettings,
  resolveToken,
  resolveTokens,
  presets,
  generatePalette,
  fitPalette,
  parseCssColor,
  parseColor,
  contrastRatio,
  CURVE_DEFAULTS,
  SHADES,
  CUSTOM_PALETTES
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
        palettes: { clay: { shades: { 500: 'oklch(65.8% 0.113 39.145)' } } }
      })

      expect(css).toContain('@theme static {')
      expect(css).toContain('  --color-clay-500: oklch(65.8% 0.113 39.145);')
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
        palettes: { signal: { shades: { 500: 'oklch(68.9% 0.187 148.921)' } } },
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
        customColors: { signal: { 500: 'oklch(68.9% 0.187 148.921)' } },
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
        palettes: { ink: { shades: { 200: 'oklch(90.1% 0 0)' } } }
      }

      const resolved = resolveToken(doc, 'light', '--ui-border')

      expect(resolved.chain).toEqual(['--ui-border', '--ui-color-neutral-200', '--color-ink-200', 'oklch(90.1% 0 0)'])
      expect(resolved.value).toBe('oklch(90.1% 0 0)')
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

  describe('palette colors', () => {
    // Mirrors the SAFE_OKLCH write boundary in useTheme.ts — a shade that
    // fails this would be silently dropped by sanitizeCustomColors.
    const CANONICAL_OKLCH = /^oklch\(\d{1,3}(?:\.\d+)?% \d(?:\.\d+)? \d{1,3}(?:\.\d+)?\)$/

    it('generatePalette emits canonical oklch strings', () => {
      const shades = generatePalette(CURVE_DEFAULTS)
      for (const shade of SHADES) {
        expect(shades[shade]).toMatch(CANONICAL_OKLCH)
      }
    })

    it('fitPalette accepts hex and oklch inputs equivalently', () => {
      // The hex ramp CUSTOM_PALETTES.cocoa was converted from.
      const cocoaHex = {
        50: '#FAF6F2', 100: '#F2E9E1', 200: '#E3D2C2', 300: '#CFB49D',
        400: '#B58F6F', 500: '#966F4C', 600: '#7C5A3C', 700: '#654931',
        800: '#533C2A', 900: '#453325', 950: '#251A12'
      } as const

      const fromHex = generatePalette(fitPalette(cocoaHex))
      const fromOklch = generatePalette(fitPalette(CUSTOM_PALETTES.cocoa!))

      // The fit is a numeric optimization — rounded oklch inputs may land a
      // hair off the full-precision hex fit, so compare channels, not strings.
      for (const shade of SHADES) {
        const a = parseColor(fromHex[shade])!
        const b = parseColor(fromOklch[shade])!
        expect(a.l, `L ${shade}`).toBeCloseTo(b.l, 2)
        expect(a.c, `C ${shade}`).toBeCloseTo(b.c, 2)
        expect(a.h, `H ${shade}`).toBeCloseTo(b.h, 0)
      }
    })

    it('parseCssColor normalizes every supported form to oklch', () => {
      expect(parseCssColor('#FFFFFF')).toBe('oklch(100% 0 0)')
      expect(parseCssColor('rgb(255, 255, 255)')).toBe('oklch(100% 0 0)')
      expect(parseCssColor('oklch(62.3% 0.214 259.815)')).toBe('oklch(62.3% 0.214 259.815)')
      expect(parseCssColor('gibberish')).toBeUndefined()
    })

    it('contrastRatio handles oklch and hex inputs', () => {
      expect(contrastRatio('oklch(100% 0 0)', 'oklch(0% 0 0)')).toBeCloseTo(21, 0)
      expect(contrastRatio('#FFFFFF', 'oklch(100% 0 0)')).toBeCloseTo(1, 1)
    })

    it('studio and preset ramps are stored as canonical oklch', () => {
      for (const [name, shades] of Object.entries(CUSTOM_PALETTES)) {
        for (const [shade, value] of Object.entries(shades)) {
          expect(value, `${name}-${shade}`).toMatch(CANONICAL_OKLCH)
        }
      }
      for (const preset of presets) {
        for (const [name, palette] of Object.entries(preset.doc.palettes || {})) {
          for (const [shade, value] of Object.entries(palette.shades)) {
            expect(value, `${preset.id} ${name}-${shade}`).toMatch(CANONICAL_OKLCH)
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
    expect(components.card!.compoundVariants).toContainEqual({ variant: 'outline', class: { root: 'ring-2 divide-y-2' } })
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
  it('custom borders set the chosen ring width; none zeroes every ring', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')

    const wide = styleComponents({ border: 'custom', borderWidth: 3 })
    expect(wide.button!.compoundVariants).toContainEqual({ variant: 'outline', class: 'ring-3' })
    expect(wide.popover!.slots!.content).toBe('ring-3')
    expect(wide.slideover!.slots!.content).toBe('sm:ring-3')
    // width only touches existing rings — never adds outlines to solids
    expect(JSON.stringify(wide.button!.compoundVariants)).not.toContain('"solid"')
    expect(JSON.stringify(wide.button!.compoundVariants)).not.toContain('"ghost"')

    const none = styleComponents({ border: 'none' })
    expect(none.card!.compoundVariants).toContainEqual({ variant: 'outline', class: { root: 'ring-0 divide-y-0' } })
    expect(none.dropdownMenu!.slots!.content).toBe('ring-0')

    // the frame toggle outlines solid/soft surfaces at the chosen width
    const framed = styleComponents({ border: 'custom', borderWidth: 3, frame: true })
    expect(framed.button!.compoundVariants).toContainEqual({ variant: 'solid', class: 'ring-3 ring-inset ring-(--ui-border-accented)' })
    expect(framed.card!.compoundVariants).toContainEqual({ variant: 'soft', class: { root: 'ring-3 ring-(--ui-border-accented)' } })
    expect(JSON.stringify(framed.button!.compoundVariants)).not.toContain('"ghost"')
    // …and the other solid surfaces: pill tabs, chat bubbles, switch track
    expect(framed.tabs!.compoundVariants).toContainEqual({ variant: 'pill', class: { list: 'ring-3 ring-inset ring-(--ui-border-accented)', indicator: 'ring-3 ring-inset ring-(--ui-border-accented)' } })
    expect(framed.chatMessage!.compoundVariants).toContainEqual({ variant: 'solid', class: { content: 'ring-3 ring-inset ring-(--ui-border-accented)' } })
    expect(framed.switch!.slots!.base).toBe('ring-3 ring-inset ring-(--ui-border-accented)')

    // border-utility edges scale with the width: chrome, separators, dividers
    expect(wide.header!.slots!.root).toBe('border-b-3')
    expect(wide.dashboardSidebar!.slots!.root).toBe('border-e-3')
    expect(wide.dashboardPanel!.slots!.root).toBe('lg:not-last:border-e-3')
    expect(wide.separator!.compoundVariants).toContainEqual({ orientation: 'horizontal', class: { border: 'border-t-3' } })
    expect(wide.table!.slots!.tbody).toBe('divide-y-3')
    expect(wide.card!.compoundVariants).toContainEqual({ variant: 'outline', class: { root: 'ring-3 divide-y-3' } })
    expect(none.header!.slots!.root).toBe('border-b-0')

    // legacy saved values keep working: bold = custom width, frame keeps outlines
    expect(styleComponents({ border: 'frame' }).button!.compoundVariants).toContainEqual({ variant: 'solid', class: 'ring-2 ring-inset ring-(--ui-border-accented)' })
    expect(styleComponents({ border: 'bold' }).input!.compoundVariants).toContainEqual({ variant: 'subtle', class: 'ring-2' })
  })

  it('border none counts as a real style choice', async () => {
    const { isDefaultStyle } = await import('../../docs/app/utils/theme-engine')
    expect(isDefaultStyle({})).toBe(true)
    expect(isDefaultStyle({ shadow: 'none', border: 'default' })).toBe(true)
    expect(isDefaultStyle({ border: 'none' })).toBe(false)
    expect(isDefaultStyle({ border: 'custom' })).toBe(false)
  })

  it('soft shadows skip ghost/link buttons (hover-only for ghost) and surfaceless fields', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const components = styleComponents({ shadow: 'soft' })

    expect(components.button!.compoundVariants).toContainEqual({ variant: 'ghost', class: 'shadow-none hover:shadow-sm transition-shadow' })
    expect(components.button!.compoundVariants).toContainEqual({ variant: 'link', class: 'shadow-none' })
    expect(components.input!.compoundVariants).toContainEqual({ variant: 'ghost', class: 'shadow-none' })
    expect(components.input!.compoundVariants).toContainEqual({ variant: 'none', class: 'shadow-none' })
  })

  it('hard shadows keep surfaceless field variants flat', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const components = styleComponents({ shadow: 'hard' })

    expect(components.select!.compoundVariants).toContainEqual({ variant: 'ghost', class: 'shadow-none' })
    expect(components.textarea!.compoundVariants).toContainEqual({ variant: 'none', class: 'shadow-none' })
  })

  it('treatments reach overlay surfaces with the right placement', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')

    const soft = styleComponents({ shadow: 'soft' })
    expect(soft.popover!.slots!.content).toBe('shadow-lg shadow-(color:--ui-shadow-final-soft)')
    expect(soft.toast!.slots!.root).toContain('--ui-shadow-final-soft')
    // modal's surface lives under the fullscreen variant — never slot classes
    expect(soft.modal!.slots).toBeUndefined()
    expect(soft.modal!.compoundVariants![0]).toMatchObject({ fullscreen: false })
    // slideover is edge-to-edge on mobile — the shadow is sm-scoped
    expect(soft.slideover!.slots!.content).toMatch(/^sm:shadow-lg /)

    const bold = styleComponents({ border: 'bold' })
    expect(bold.dropdownMenu!.slots!.content).toBe('ring-2')
    expect(bold.selectMenu!.slots!.content).toBe('ring-2')
    expect(bold.selectMenu!.compoundVariants).toContainEqual({ variant: 'outline', class: 'ring-2' })
    expect(bold.checkbox!.slots!.base).toBe('ring-2')

    const colored = styleComponents({ borderColor: 'inverted' })
    expect(colored.tooltip!.slots!.content).toBe('ring-(--ui-frame-color)')
    expect(colored.modal!.compoundVariants![0]).toEqual({ fullscreen: false, class: { content: 'ring-(--ui-frame-color)' } })
  })

  it('the whole input family follows the inputs group', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const components = styleComponents({ defaults: { variants: { inputs: 'subtle' }, size: 'lg' } })

    for (const component of ['input', 'select', 'textarea', 'selectMenu', 'inputMenu', 'inputNumber', 'inputTags', 'inputDate', 'inputTime', 'pinInput']) {
      expect(components[component]!.defaultVariants!.variant, component).toBe('subtle')
      expect(components[component]!.defaultVariants!.size, component).toBe('lg')
    }
    // size-only member gets size but never a variant
    expect(components.inputRating!.defaultVariants).toEqual({ size: 'lg' })
    // empty joins the panels group
    const panels = styleComponents({ defaults: { variants: { panels: 'soft' } } })
    expect(panels.empty!.defaultVariants).toEqual({ variant: 'soft' })
  })

  it('border recoloring spares semantic outline rings but frames every solid', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const compounds = styleComponents({ border: 'frame', borderColor: 'primary' }).button!.compoundVariants!

    // outline/subtle rings ARE the semantic signal — only primary/neutral repaint
    expect(compounds).toContainEqual({ color: ['primary', 'neutral'], variant: 'outline', class: 'ring-(--ui-frame-color)' })
    expect(compounds).toContainEqual({ color: ['primary', 'neutral'], variant: 'subtle', class: 'ring-(--ui-frame-color)' })
    // frames around solid/soft surfaces repaint for every color
    expect(compounds).toContainEqual({ variant: 'solid', class: 'ring-(--ui-frame-color)' })
    expect(compounds).toContainEqual({ variant: 'soft', class: 'ring-(--ui-frame-color)' })
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

  it('styleTokens maps primary-ramp token shades and shade modes', async () => {
    const { styleTokens } = await import('../../docs/app/utils/theme-engine')

    // --ui-primary walks the PRIMARY ramp, not neutral
    expect(styleTokens({ tokenShades: { '--ui-primary': { light: 600, dark: 300 } } })).toEqual({
      light: { '--ui-primary': 'var(--ui-color-primary-600)' },
      dark: { '--ui-primary': 'var(--ui-color-primary-300)' }
    })
    // primary-shade modes reroute the frame/shadow colors through the primary ramp
    expect(styleTokens({ borderColor: 'primary-shade', borderShade: { light: 700, dark: 300 } })).toEqual({
      light: { '--ui-frame-color': 'var(--ui-color-primary-700)' },
      dark: { '--ui-frame-color': 'var(--ui-color-primary-300)' }
    })
    expect(styleTokens({ shadowColor: 'primary-shade' }).light['--ui-shadow-color']).toBe('var(--ui-color-primary-950)')
  })

  it('semantic alias and bg/text/border tokens ride their own ramps', async () => {
    const { styleTokens, TOKEN_SHADE_TARGETS } = await import('../../docs/app/utils/theme-engine')

    // every semantic alias token references its own color scale
    expect(styleTokens({ tokenShades: { '--ui-secondary': { light: 600 }, '--ui-error': { dark: 300 } } })).toEqual({
      light: { '--ui-secondary': 'var(--ui-color-secondary-600)' },
      dark: { '--ui-error': 'var(--ui-color-error-300)' }
    })
    // the expanded surface/text/border tokens stay on the neutral ramp
    expect(styleTokens({ tokenShades: { '--ui-bg-elevated': { light: 200 }, '--ui-text-toned': { dark: 200 }, '--ui-border-accented': { light: 400 } } })).toEqual({
      light: { '--ui-bg-elevated': 'var(--ui-color-neutral-200)', '--ui-border-accented': 'var(--ui-color-neutral-400)' },
      dark: { '--ui-text-toned': 'var(--ui-color-neutral-200)' }
    })

    // the full sets the sidebar promises are all present
    const tokens = TOKEN_SHADE_TARGETS.map(target => target.token)
    for (const expected of [
      '--ui-primary', '--ui-secondary', '--ui-success', '--ui-info', '--ui-warning', '--ui-error',
      '--ui-bg', '--ui-bg-muted', '--ui-bg-elevated', '--ui-bg-accented', '--ui-bg-inverted',
      '--ui-text-dimmed', '--ui-text-muted', '--ui-text-toned', '--ui-text', '--ui-text-highlighted', '--ui-text-inverted',
      '--ui-border', '--ui-border-muted', '--ui-border-accented', '--ui-border-inverted'
    ]) {
      expect(tokens, expected).toContain(expected)
    }
  })

  it('font size and spacing export as html rule and @theme override', async () => {
    const { generateCSS, docToSettings, isDefaultTheme } = await import('../../docs/app/utils/theme-engine')

    const css = generateCSS({ version: 1, fontSize: 15, spacing: 0.3 })
    expect(css).toContain('html {\n  font-size: 15px;\n}')
    expect(css).toContain('@theme {\n  --spacing: 0.3rem;\n}')

    // defaults export nothing
    const defaultCss = generateCSS({ version: 1, fontSize: 16, spacing: 0.25 })
    expect(defaultCss).not.toContain('font-size')
    expect(defaultCss).not.toContain('--spacing')

    expect(docToSettings({ version: 1, fontSize: 15, spacing: 0.3 })).toEqual({ fontSize: 15, spacing: 0.3 })
    expect(isDefaultTheme({ version: 1, fontSize: 15 })).toBe(false)
    expect(isDefaultTheme({ version: 1, spacing: 0.3 })).toBe(false)
  })

  it('per-group default variants refine the app-wide value', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')
    const components = styleComponents({ defaults: { variant: 'solid', variants: { inputs: 'subtle', panels: 'outline' } } })

    // untouched group keeps the app-wide value
    expect(components.button!.defaultVariants).toEqual({ variant: 'solid' })
    // group choices win for their components
    expect(components.input!.defaultVariants).toEqual({ variant: 'subtle' })
    expect(components.card!.defaultVariants).toEqual({ variant: 'outline' })
    expect(components.alert!.defaultVariants).toEqual({ variant: 'outline' })
    // group-only, no app-wide: other groups untouched
    const only = styleComponents({ defaults: { variants: { buttons: 'soft' } } })
    expect(only.badge!.defaultVariants).toEqual({ variant: 'soft' })
    expect(only.input).toBeUndefined()
  })

  it('component-specific variants apply only where supported', async () => {
    const { styleComponents } = await import('../../docs/app/utils/theme-engine')

    // ghost/link exist on buttons but not badges — the group skips badges
    const ghost = styleComponents({ defaults: { variants: { buttons: 'ghost' } } })
    expect(ghost.button!.defaultVariants).toEqual({ variant: 'ghost' })
    expect(ghost.badge).toBeUndefined()
    const link = styleComponents({ defaults: { variants: { buttons: 'link' } } })
    expect(link.button!.defaultVariants).toEqual({ variant: 'link' })

    // form fields support ghost and none
    const none = styleComponents({ defaults: { variants: { inputs: 'none' } } })
    expect(none.input!.defaultVariants).toEqual({ variant: 'none' })
    expect(none.select!.defaultVariants).toEqual({ variant: 'none' })
    expect(none.textarea!.defaultVariants).toEqual({ variant: 'none' })
    const ghostFields = styleComponents({ defaults: { variants: { inputs: 'ghost' } } })
    expect(ghostFields.input!.defaultVariants).toEqual({ variant: 'ghost' })
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
