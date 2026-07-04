import { useLocalStorage } from '@vueuse/core'
import { presets, docToSettings, isDefaultTheme, generatePalette, DEFAULT_COLORS } from '../utils/theme-engine'
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
    setPaletteFromCurve,
    clearCustomPalette,
    applyDoc,
    applyPreset,
    shuffle,
    reset
  }
}
