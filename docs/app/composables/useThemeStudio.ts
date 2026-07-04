import { presets, docToSettings, isDefaultTheme } from '../utils/theme-engine'
import type { ThemeDoc, ThemePreset } from '../utils/theme-engine'

export function useThemeStudio() {
  const theme = useTheme()
  const { track } = useAnalytics()

  const activePreset = useState<string | undefined>('nuxt-ui-theme-preset', () => undefined)

  /** Replace the current theme with a document: reset, then apply overrides. */
  function applyDoc(doc: ThemeDoc) {
    theme.resetTheme()

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
    activePreset.value = undefined
  }

  return {
    presets,
    activePreset,
    applyDoc,
    applyPreset,
    shuffle,
    reset
  }
}
