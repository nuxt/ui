import { useLocalStorage } from '@vueuse/core'
import colors from 'tailwindcss/colors'
import { presets, docToSettings, isDefaultTheme, generatePalette, parseCssColor, DEFAULT_COLORS } from '../utils/theme-engine'
import type { ThemeDoc, ThemePreset, PaletteCurveParams } from '../utils/theme-engine'

export function useThemeStudio() {
  const theme = useTheme()
  const appConfig = useAppConfig()
  const { track } = useAnalytics()

  const activePreset = useState<string | undefined>('nuxt-ui-theme-preset', () => undefined)

  /** Curve params per alias, kept so the editor stays editable across reloads. */
  const paletteParams = useLocalStorage<Partial<Record<string, PaletteCurveParams>>>('nuxt-ui-palette-params', {})

  function customPaletteName(alias: string) {
    return `custom-${alias}`
  }

  function isCustomPalette(alias: string) {
    return (appConfig.ui.colors as Record<string, string>)[alias] === customPaletteName(alias)
  }

  /** The 500 hex of a named palette — tailwind's JS values first, CSS variables as fallback. */
  function anchorFromPalette(name: string): string | undefined {
    const tailwind = (colors as Record<string, any>)[name]?.[500]
    if (tailwind) return parseCssColor(tailwind)

    if (import.meta.client) {
      const cssValue = getComputedStyle(document.documentElement).getPropertyValue(`--color-${name === 'neutral' ? 'old-neutral' : name}-500`)
      if (cssValue) return parseCssColor(cssValue)
    }
    return undefined
  }

  /**
   * Swatch-click entry point. With a custom palette active the swatches act
   * as anchor pickers — the custom ramp re-anchors to the chosen palette's
   * color and keeps its curve. Otherwise it is a plain alias switch.
   */
  function selectPalette(alias: 'primary' | 'neutral', name: string) {
    if (isCustomPalette(alias)) {
      const anchor = anchorFromPalette(name)
      if (anchor) {
        setPaletteFromCurve(alias, { ...paletteParams.value[alias], anchor })
        return
      }
    }

    if (alias === 'primary') {
      theme.primary.value = name
    } else {
      theme.neutral.value = name
    }
  }

  /** Generate a ramp from curve params and point the alias at it. */
  function setPaletteFromCurve(alias: 'primary' | 'neutral', params: PaletteCurveParams) {
    const name = customPaletteName(alias)

    theme.applyThemeSettings({
      customColors: { [name]: generatePalette(params) },
      [alias]: name
    })
    paletteParams.value = { ...paletteParams.value, [alias]: params }
    activePreset.value = undefined

    track('Theme Custom Palette', { alias })
  }

  /** Drop the custom ramp and return the alias to its default palette. */
  function clearCustomPalette(alias: 'primary' | 'neutral') {
    theme.removeCustomColors([customPaletteName(alias)])
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
    anchorFromPalette,
    selectPalette,
    setPaletteFromCurve,
    clearCustomPalette,
    applyDoc,
    applyPreset,
    shuffle,
    reset
  }
}
