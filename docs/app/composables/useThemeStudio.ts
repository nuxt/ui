import { useLocalStorage } from '@vueuse/core'
import colors from 'tailwindcss/colors'
import { presets, docToSettings, isDefaultTheme, generatePalette, fitPalette, parseCssColor, DEFAULT_COLORS, SHADES } from '../utils/theme-engine'
import type { ThemeDoc, ThemePreset, PaletteCurveParams, Shade } from '../utils/theme-engine'

export function useThemeStudio() {
  const theme = useTheme()
  const appConfig = useAppConfig()
  const { track } = useAnalytics()

  const activePreset = useState<string | undefined>('nuxt-ui-theme-preset', () => undefined)

  /** Curve params per alias, kept so the editor stays editable across reloads. */
  const paletteParams = useLocalStorage<Partial<Record<string, PaletteCurveParams>>>('nuxt-ui-palette-params', {})

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

  /** Replace the current theme with a document: reset, then apply overrides. */
  function applyDoc(doc: ThemeDoc) {
    theme.resetTheme()
    paletteParams.value = {}

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
      font: { sans: pick(theme.fonts) }
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
    activePreset.value = undefined
  }

  return {
    presets,
    activePreset,
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
