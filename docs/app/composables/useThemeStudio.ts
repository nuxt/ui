import { useLocalStorage } from '@vueuse/core'
import colors from 'tailwindcss/colors'
import { presets, docToSettings, isDefaultTheme, generatePalette, fitPalette, parseCssColor, styleComponents, styleTokens, DEFAULT_COLORS, SHADES, STYLE_COMPONENT_KEYS, TOKEN_SHADE_TARGETS } from '../utils/theme-engine'
import type { ThemeDoc, ThemePreset, PaletteCurveParams, Shade, StyleOptions } from '../utils/theme-engine'

export function useThemeStudio() {
  const theme = useTheme()
  const appConfig = useAppConfig()
  const { track } = useAnalytics()

  const activePreset = useState<string | undefined>('nuxt-ui-theme-preset', () => undefined)

  /** Curve params per alias, kept so the editor stays editable across reloads. */
  const paletteParams = useLocalStorage<Partial<Record<string, PaletteCurveParams>>>('nuxt-ui-palette-params', {})

  /** Shadow/border treatment; the expanded overrides live in the ai-theme extras. */
  const style = useLocalStorage<StyleOptions>('nuxt-ui-style', {})

  function setStyle(options: StyleOptions) {
    const previous = styleTokens(style.value)
    style.value = { ...style.value, ...options }

    // Clear the previous class bundle (defu merging can't unset classes) and
    // only the tokens the PREVIOUS style emitted — never preset/doc-owned
    // values like a preset's --ui-bg, which share the same variable names.
    theme.resetComponentOverrides(STYLE_COMPONENT_KEYS)
    const tokens = styleTokens(style.value)
    theme.removeCSSVariables({
      light: Object.keys(previous.light).filter(key => !(key in tokens.light)),
      dark: Object.keys(previous.dark).filter(key => !(key in tokens.dark))
    })

    const components = styleComponents(style.value)
    const settings: Record<string, any> = {}
    if (Object.keys(components).length) settings.ui = components
    if (Object.keys(tokens.light).length || Object.keys(tokens.dark).length) settings.cssVariables = tokens
    if (Object.keys(settings).length) {
      theme.applyThemeSettings(settings)
    }
    activePreset.value = undefined

    track('Theme Style Changed', { ...style.value })
  }

  let trackedAt: number | undefined

  function customPaletteName(alias: string) {
    return `custom-${alias}`
  }

  function isCustomPalette(alias: string) {
    return (appConfig.ui.colors as Record<string, string>)[alias] === customPaletteName(alias)
  }

  /** All 11 shade hexes of a named palette — tailwind's JS values first, CSS variables as fallback. */
  function paletteShades(name: string): Partial<Record<Shade, string>> | undefined {
    const tailwind = (colors as Record<string, any>)[name]
    if (tailwind && typeof tailwind === 'object') {
      return Object.fromEntries(SHADES.map(shade => [shade, parseCssColor(tailwind[shade])]).filter(([, hex]) => hex))
    }

    if (import.meta.client) {
      const styles = getComputedStyle(document.documentElement)
      const cssName = name === 'neutral' ? 'old-neutral' : name
      const entries = SHADES
        .map(shade => [shade, parseCssColor(styles.getPropertyValue(`--color-${cssName}-${shade}`))] as const)
        .filter(([, hex]) => hex)
      if (entries.length >= 2) {
        return Object.fromEntries(entries)
      }
    }
    return undefined
  }

  /**
   * Swatch-click entry point. With a custom palette active the swatches act
   * as curve seeds: the chosen palette is reverse-fitted so the editor shows
   * the curves that reproduce it, replacing whatever was sculpted before.
   * Otherwise it is a plain alias switch.
   */
  function selectPalette(alias: 'primary' | 'neutral', name: string) {
    if (isCustomPalette(alias)) {
      const shades = paletteShades(name)
      if (shades) {
        setPaletteFromCurve(alias, fitPalette(shades))
        return
      }
    }

    if (alias === 'primary') {
      theme.primary.value = name
    } else {
      theme.neutral.value = name
    }
  }

  /**
   * Light mode hardcodes `--ui-bg`/`--ui-text-inverted` to `white` (and dark
   * `--ui-text-highlighted`), so a tinted neutral ramp would never reach the
   * app background. A custom neutral re-routes them through the ramp.
   */
  const NEUTRAL_TOKEN_REMAPS = {
    light: {
      '--ui-bg': 'var(--ui-color-neutral-50)',
      '--ui-text-inverted': 'var(--ui-color-neutral-50)'
    },
    dark: {
      '--ui-text-highlighted': 'var(--ui-color-neutral-50)'
    }
  }

  /** Generate a ramp from curve params and point the alias at it. */
  function setPaletteFromCurve(alias: 'primary' | 'neutral', params: PaletteCurveParams) {
    const name = customPaletteName(alias)

    theme.applyThemeSettings({
      customColors: { [name]: generatePalette(params) },
      [alias]: name,
      ...(alias === 'neutral' ? { cssVariables: NEUTRAL_TOKEN_REMAPS } : {})
    })
    paletteParams.value = { ...paletteParams.value, [alias]: params }
    activePreset.value = undefined

    // Live drags call this at ~16Hz — one analytics event per burst is plenty.
    if (!trackedAt || Date.now() - trackedAt > 2000) {
      trackedAt = Date.now()
      track('Theme Custom Palette', { alias })
    }
  }

  /** Drop the custom ramp and return the alias to its default palette. */
  function clearCustomPalette(alias: 'primary' | 'neutral') {
    theme.removeCustomColors([customPaletteName(alias)])
    if (alias === 'neutral') {
      theme.removeCSSVariables({
        light: Object.keys(NEUTRAL_TOKEN_REMAPS.light),
        dark: Object.keys(NEUTRAL_TOKEN_REMAPS.dark)
      })
    }
    theme.applyThemeSettings({ [alias]: DEFAULT_COLORS[alias] })

    const { [alias]: _, ...rest } = paletteParams.value
    paletteParams.value = rest
  }

  /**
   * Reflect a doc's token overrides back into the sidebar's shade settings
   * where they are representable, so controls show the preset's reality
   * instead of stale defaults. Only neutral-ramp refs map onto sliders;
   * anything else (white/black literals, non-neutral refs) stays token-only.
   */
  function deriveStyle(doc: ThemeDoc): StyleOptions {
    const derived: StyleOptions = { ...(doc.style || {}) }

    const parse = (value?: string) => value?.match(/^var\(--ui-color-neutral-(\d+)\)$/)?.[1]

    for (const target of TOKEN_SHADE_TARGETS) {
      if (derived.tokenShades?.[target.token]) continue

      const light = parse(doc.tokens?.light?.[target.token])
      const dark = parse(doc.tokens?.dark?.[target.token])
      if (light || dark) {
        derived.tokenShades = {
          ...derived.tokenShades,
          [target.token]: {
            light: light ? Number(light) : target.defaults.light,
            dark: dark ? Number(dark) : target.defaults.dark
          }
        }
      }
    }

    return derived
  }

  /** Replace the current theme with a document: reset, then apply overrides. */
  function applyDoc(doc: ThemeDoc) {
    theme.resetTheme()
    paletteParams.value = {}
    style.value = deriveStyle(doc)

    if (!isDefaultTheme(doc)) {
      theme.applyThemeSettings(docToSettings(doc))
    }
  }

  function applyPreset(preset: ThemePreset) {
    applyDoc(preset.doc)
    activePreset.value = preset.id

    track('Theme Preset Applied', { preset: preset.id })
  }

  function pick<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T
  }

  function shuffle() {
    const doc: ThemeDoc = {
      version: 1,
      colors: {
        primary: pick(theme.primaryColors),
        neutral: pick(theme.neutralColors)
      },
      radius: pick(theme.radiuses),
      font: { sans: pick(theme.fonts) },
      // Weighted so most rolls stay clean, with the occasional loud one.
      style: {
        shadow: pick(['none', 'none', 'soft', 'hard'] as const),
        border: pick(['default', 'default', 'bold'] as const)
      }
    }

    if (Math.random() < 0.125) {
      doc.blackAsPrimary = true
      delete doc.colors!.primary
    }

    applyDoc(doc)
    activePreset.value = undefined

    track('Theme Studio Shuffled')
  }

  function reset() {
    theme.resetTheme()
    paletteParams.value = {}
    style.value = {}
    activePreset.value = undefined
  }

  return {
    presets,
    activePreset,
    style,
    setStyle,
    paletteParams,
    isCustomPalette,
    paletteShades,
    selectPalette,
    setPaletteFromCurve,
    clearCustomPalette,
    applyDoc,
    applyPreset,
    shuffle,
    reset
  }
}
