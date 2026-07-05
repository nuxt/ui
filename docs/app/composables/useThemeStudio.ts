import colors from 'tailwindcss/colors'
import { presets, docToSettings, isDefaultTheme, generatePalette, fitPalette, parseCssColor, parseUiColorRef, styleComponents, styleTokens, DEFAULT_COLORS, SHADES, TOKEN_SHADE_TARGETS } from '../utils/theme-engine'
import type { ThemeDoc, ThemePreset, PaletteCurveParams, StyleOptions, Shade, ColorAlias } from '../utils/theme-engine'

function readLocalStorage<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function useThemeStudio() {
  const theme = useTheme()
  const appConfig = useAppConfig()
  const { track } = useAnalytics()

  const activePreset = useState<string | undefined>('nuxt-ui-theme-preset', () => undefined)

  /**
   * Curve params per alias, kept so the editor stays editable across
   * reloads. useState + explicit persistence (not useLocalStorage) so
   * resetTheme() — reachable from the popover and chat, outside this
   * composable — can clear the shared state, not just the storage key.
   */
  const paletteParams = useState<Partial<Record<string, PaletteCurveParams>>>('nuxt-ui-palette-params-state', () => readLocalStorage('nuxt-ui-palette-params', {}))

  function setPaletteParams(value: Partial<Record<string, PaletteCurveParams>>) {
    paletteParams.value = value
    if (Object.keys(value).length) {
      window.localStorage.setItem('nuxt-ui-palette-params', JSON.stringify(value))
    } else {
      window.localStorage.removeItem('nuxt-ui-palette-params')
    }
  }

  /** Shadow/border/token-shade prefs; the expanded class bundle lives in the style-ui channel. */
  const style = useState<StyleOptions>('nuxt-ui-style-prefs', () => readLocalStorage('nuxt-ui-style', {}))

  // Self-heal: the persisted class bundle is an expansion of `style` frozen
  // at write time — if the generator changed since (new fragment classes),
  // regenerate it once so stale classes don't outlive their source.
  if (import.meta.client) {
    const expected = styleComponents(style.value)
    if (JSON.stringify(expected) !== JSON.stringify(readLocalStorage('nuxt-ui-style-ui', {}))) {
      onNuxtReady(() => theme.setStyleUi(expected))
    }
  }

  function setStyle(options: StyleOptions) {
    const previousStyle = style.value
    const previous = styleTokens(previousStyle)
    style.value = { ...style.value, ...options }
    window.localStorage.setItem('nuxt-ui-style', JSON.stringify(style.value))

    // Remove only the tokens the PREVIOUS style emitted and the next one
    // doesn't — never preset/doc-owned values sharing the same names.
    const tokens = styleTokens(style.value)
    theme.removeCSSVariables({
      light: Object.keys(previous.light).filter(key => !(key in tokens.light)),
      dark: Object.keys(previous.dark).filter(key => !(key in tokens.dark))
    })

    // The class bundle lives in its own channel (never touches preset/AI
    // overrides), and shade-only edits skip the component churn entirely.
    const components = styleComponents(style.value)
    if (JSON.stringify(components) !== JSON.stringify(styleComponents(previousStyle))) {
      theme.setStyleUi(components)
    }

    if (Object.keys(tokens.light).length || Object.keys(tokens.dark).length) {
      theme.applyThemeSettings({ cssVariables: tokens }, { track: false })
    }
    activePreset.value = undefined

    track('Theme Style Changed', {
      shadow: style.value.shadow || 'none',
      border: style.value.border || 'default',
      borderColor: style.value.borderColor || 'default',
      shadowColor: style.value.shadowColor || 'default'
    })
  }

  let trackedAt: number | undefined

  function customPaletteName(alias: string) {
    return `custom-${alias}`
  }

  function isCustomPalette(alias: string) {
    return (appConfig.ui.colors as Record<string, string>)[alias] === customPaletteName(alias)
  }

  /** All 11 shades of a named palette as oklch — tailwind's JS values first, CSS variables as fallback. */
  function paletteShades(name: string): Partial<Record<Shade, string>> | undefined {
    const tailwind = (colors as Record<string, any>)[name]
    if (tailwind && typeof tailwind === 'object') {
      return Object.fromEntries(SHADES.map(shade => [shade, parseCssColor(tailwind[shade])]).filter(([, color]) => color))
    }

    if (import.meta.client) {
      const styles = getComputedStyle(document.documentElement)
      const cssName = name === 'neutral' ? 'old-neutral' : name
      const entries = SHADES
        .map(shade => [shade, parseCssColor(styles.getPropertyValue(`--color-${cssName}-${shade}`))] as const)
        .filter(([, color]) => color)
      if (entries.length >= 2) {
        return Object.fromEntries(entries)
      }
    }
    return undefined
  }

  /**
   * Swatch-click entry point, for any color alias. With a custom palette
   * active the primary/neutral swatches act as curve seeds: the chosen
   * palette is reverse-fitted so the editor shows the curves that reproduce
   * it, replacing whatever was sculpted before. Otherwise it is a plain
   * alias switch; semantic aliases ride the same persistence channel the
   * AI theme feature uses.
   */
  function selectPalette(alias: ColorAlias, name: string) {
    if ((alias === 'primary' || alias === 'neutral') && isCustomPalette(alias)) {
      const shades = paletteShades(name)
      if (shades) {
        setPaletteFromCurve(alias, fitPalette(shades))
        return
      }
    }

    if (alias === 'primary') {
      theme.primary.value = name
    } else if (alias === 'neutral') {
      theme.neutral.value = name
    } else {
      theme.applyThemeSettings({ [alias]: name }, { track: false })
      activePreset.value = undefined
      track('Theme Changed', { setting: alias, value: name })
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

  /** Remaps minus any token the user's shade sliders already own. */
  function unownedNeutralRemaps() {
    const owned = style.value.tokenShades || {}
    const filter = (mode: 'light' | 'dark', vars: Record<string, string>) =>
      Object.fromEntries(Object.entries(vars).filter(([token]) => owned[token]?.[mode] === undefined))
    return {
      light: filter('light', NEUTRAL_TOKEN_REMAPS.light),
      dark: filter('dark', NEUTRAL_TOKEN_REMAPS.dark)
    }
  }

  /** Generate a ramp from curve params and point the alias at it. */
  function setPaletteFromCurve(alias: 'primary' | 'neutral', params: PaletteCurveParams) {
    const name = customPaletteName(alias)

    // Remember what to restore when the custom palette is removed — the
    // default alias would discard a preset's choice (e.g. Ghibli's stone).
    if (!isCustomPalette(alias)) {
      const prev = readLocalStorage<Record<string, string>>('nuxt-ui-palette-prev', {})
      prev[alias] = (appConfig.ui.colors as Record<string, string>)[alias]!
      window.localStorage.setItem('nuxt-ui-palette-prev', JSON.stringify(prev))
    }

    theme.applyThemeSettings({
      customColors: { [name]: generatePalette(params) },
      [alias]: name,
      ...(alias === 'neutral' ? { cssVariables: unownedNeutralRemaps() } : {})
    }, { track: false })
    setPaletteParams({ ...paletteParams.value, [alias]: params })
    activePreset.value = undefined

    // Live drags call this at ~16Hz — one analytics event per burst is plenty.
    if (!trackedAt || Date.now() - trackedAt > 2000) {
      trackedAt = Date.now()
      track('Theme Custom Palette', { alias })
    }
  }

  /** Drop the custom ramp and restore the palette that preceded it. */
  function clearCustomPalette(alias: 'primary' | 'neutral') {
    theme.removeCustomColors([customPaletteName(alias)])
    if (alias === 'neutral') {
      const remaps = unownedNeutralRemaps()
      theme.removeCSSVariables({
        light: Object.keys(remaps.light),
        dark: Object.keys(remaps.dark)
      })
    }

    const prev = readLocalStorage<Record<string, string>>('nuxt-ui-palette-prev', {})
    theme.applyThemeSettings({ [alias]: prev[alias] || DEFAULT_COLORS[alias] }, { track: false })
    const { [alias]: _restored, ...remaining } = prev
    window.localStorage.setItem('nuxt-ui-palette-prev', JSON.stringify(remaining))

    const { [alias]: _, ...rest } = paletteParams.value
    setPaletteParams(rest)
  }

  /**
   * Reflect a doc's token overrides back into the sidebar's shade settings
   * where they are representable, so controls show the preset's reality
   * instead of stale defaults. Only neutral-ramp refs map onto sliders;
   * anything else (white/black literals, non-neutral refs) stays token-only.
   */
  function deriveStyle(doc: ThemeDoc): StyleOptions {
    const derived: StyleOptions = { ...(doc.style || {}) }

    const parse = (value: string | undefined, ramp: string) => {
      const ref = parseUiColorRef(value)
      return ref?.alias === ramp ? ref.shade : undefined
    }

    for (const target of TOKEN_SHADE_TARGETS) {
      if (derived.tokenShades?.[target.token]) continue

      const light = parse(doc.tokens?.light?.[target.token], target.ramp)
      const dark = parse(doc.tokens?.dark?.[target.token], target.ramp)
      if (light !== undefined || dark !== undefined) {
        // Only modes the doc actually overrides — backfilling the other
        // mode would turn a non-choice into an exported override.
        derived.tokenShades = {
          ...derived.tokenShades,
          [target.token]: {
            ...(light !== undefined ? { light } : {}),
            ...(dark !== undefined ? { dark } : {})
          }
        }
      }
    }

    return derived
  }

  /** Replace the current theme with a document: reset, then apply overrides. */
  function applyDoc(doc: ThemeDoc) {
    theme.resetTheme()
    style.value = deriveStyle(doc)
    if (Object.keys(style.value).length) {
      window.localStorage.setItem('nuxt-ui-style', JSON.stringify(style.value))
    }

    if (!isDefaultTheme(doc)) {
      theme.applyThemeSettings(docToSettings(doc), { track: false })
      const components = styleComponents(style.value)
      if (Object.keys(components).length) {
        theme.setStyleUi(components)
      }
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
        border: pick(['default', 'default', 'bold', 'frame'] as const)
      }
    }

    // Colored borders/shadows and app-wide variants are the loud rolls —
    // sprinkle them in rarely enough that most shuffles stay tasteful.
    if (doc.style!.border !== 'default' && Math.random() < 0.4) {
      doc.style!.borderColor = pick(['inverted', 'primary', 'neutral'] as const)
    }
    if (doc.style!.shadow === 'hard' && Math.random() < 0.4) {
      doc.style!.shadowColor = pick(['black', 'inverted', 'primary'] as const)
    }
    if (Math.random() < 0.25) {
      doc.style!.defaults = { variant: pick(['solid', 'outline', 'soft', 'subtle'] as const) }
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
