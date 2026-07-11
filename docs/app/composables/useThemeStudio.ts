import colors from 'tailwindcss/colors'
import { THEME_STATE_KEYS, THEME_STORAGE_KEYS } from '../utils/theme-keys'
import { presets, docToSettings, isDefaultTheme, generatePalette, applyPaletteEffects, isDefaultEffects, parseCssColor, parseUiColorRef, styleComponents, styleTokens, sectionFingerprint, mergeSection, SECTION_GROUPS, DEFAULT_COLORS, SHADES, TOKEN_SHADE_TARGETS } from '../utils/theme-engine'
import type { SectionKey, ThemeDoc, ThemePreset, PaletteCurveParams, PaletteEffects, StoredPaletteParams, StyleOptions, Shade, ColorAlias, TokenRamp } from '../utils/theme-engine'
import { readLocalStorage } from '../utils/theme'

export function useThemeStudio() {
  const theme = useTheme()
  const appConfig = useAppConfig()
  const { track } = useAnalytics()

  /**
   * The BASELINE preset: stays set through ordinary edits (per-section
   * dirty/reset measures against it) and is only replaced by another
   * preset, a shuffle, an import or a full reset. Persisted so the menu
   * still names it after a reload.
   */
  const activePreset = useState<string | undefined>(THEME_STATE_KEYS.themePreset, () => readLocalStorage(THEME_STORAGE_KEYS.preset, undefined))

  function setActivePreset(id: string | undefined) {
    activePreset.value = id
    if (!import.meta.client) return
    if (id) {
      window.localStorage.setItem(THEME_STORAGE_KEYS.preset, JSON.stringify(id))
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEYS.preset)
    }
  }

  /**
   * Curve params per alias, kept so the editor stays editable across
   * reloads. useState + explicit persistence (not useLocalStorage) so
   * resetTheme() — reachable from the popover and chat, outside this
   * composable — can clear the shared state, not just the storage key.
   */
  const paletteParams = useState<Partial<Record<string, StoredPaletteParams>>>(THEME_STATE_KEYS.paletteParams, () => readLocalStorage(THEME_STORAGE_KEYS.paletteParams, {}))

  function setPaletteParams(value: Partial<Record<string, StoredPaletteParams>>) {
    paletteParams.value = value
    if (Object.keys(value).length) {
      window.localStorage.setItem(THEME_STORAGE_KEYS.paletteParams, JSON.stringify(value))
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEYS.paletteParams)
    }
  }

  /** Shadow/border/token-shade prefs; the expanded class bundle lives in the style-ui channel. */
  const style = useState<StyleOptions>(THEME_STATE_KEYS.stylePrefs, () => readLocalStorage(THEME_STORAGE_KEYS.style, {}))

  // Self-heal: the persisted class bundle is an expansion of `style` frozen
  // at write time — if the generator changed since (new fragment classes),
  // regenerate it once so stale classes don't outlive their source. Guarded
  // so the dozens of components calling this composable check only once.
  const healed = useState('nuxt-ui-style-healed', () => false)
  if (import.meta.client && !healed.value) {
    healed.value = true
    try {
      const expected = styleComponents(style.value)
      if (JSON.stringify(expected) !== JSON.stringify(readLocalStorage(THEME_STORAGE_KEYS.styleUi, {}))) {
        onNuxtReady(() => theme.setStyleUi(expected))
      }
    } catch {
      // A throwing expansion (corrupt persisted style) shouldn't permanently
      // disable healing — retry on the next load.
      healed.value = false
    }
  }

  // Shared across composable instances so the analytics throttle holds no
  // matter which component fires the event.
  const trackedAt = useState<number | undefined>('nuxt-ui-style-tracked-at', () => undefined)

  function setStyle(options: StyleOptions) {
    const previousStyle = style.value
    const previous = styleTokens(previousStyle)
    style.value = { ...style.value, ...options }
    window.localStorage.setItem(THEME_STORAGE_KEYS.style, JSON.stringify(style.value))

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

    // Sliders stream through here at drag frequency — one event per burst.
    if (!trackedAt.value || Date.now() - trackedAt.value > 2000) {
      trackedAt.value = Date.now()
      track('Theme Style Changed', {
        shadow: style.value.shadow || 'none',
        border: style.value.border || 'default',
        borderColor: style.value.borderColor || 'default',
        shadowColor: style.value.shadowColor || 'default'
      })
    }
  }

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
   * Swatch-click entry point, for any color alias — always a real alias
   * switch. A custom palette in place is dropped first (its curves and
   * modifiers included), so the menu names the selection instead of a
   * stale Custom; an open editor refits from the new color by itself.
   */
  function selectPalette(alias: ColorAlias, name: string) {
    if (isCustomPalette(alias)) {
      clearCustomPalette(alias)
    }

    if (alias === 'primary') {
      theme.primary.value = name
    } else if (alias === 'neutral') {
      theme.neutral.value = name
      // Stock neutrals need the white-literal remaps too — without them the
      // preview (docs baseline: neutral-50 bg) diverges from the export
      // (library baseline: white bg) for every tinted ramp.
      theme.applyThemeSettings({ cssVariables: unownedNeutralRemaps() }, { track: false })
    } else {
      theme.applyThemeSettings({ [alias]: name }, { track: false })
      track('Theme Changed', { setting: alias, value: name })
    }
  }

  /**
   * The library hardcodes five tokens to `white` (light `--ui-bg` and
   * `--ui-text-inverted`; dark `--ui-text-highlighted`, `--ui-bg-inverted`
   * and `--ui-border-inverted`), so a tinted neutral ramp would never reach
   * them. Choosing a neutral re-routes all five through the ramp — which is
   * also what makes the export reproduce the preview, since the docs
   * baseline already shows neutral-50 as the page background.
   */
  const NEUTRAL_TOKEN_REMAPS = {
    light: {
      '--ui-bg': 'var(--ui-color-neutral-50)',
      '--ui-text-inverted': 'var(--ui-color-neutral-50)'
    },
    dark: {
      '--ui-text-highlighted': 'var(--ui-color-neutral-50)',
      '--ui-bg-inverted': 'var(--ui-color-neutral-50)',
      '--ui-border-inverted': 'var(--ui-color-neutral-50)'
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

  /**
   * Generate a ramp and point the alias at it. The base curves and the
   * modifier lens persist separately, so a reload restores the editor's
   * sliders instead of silently baking them into the curves.
   */
  function setPaletteFromCurve(alias: ColorAlias, base: PaletteCurveParams, effects?: PaletteEffects, amount = 100) {
    const name = customPaletteName(alias)

    theme.applyThemeSettings({
      customColors: { [name]: generatePalette(applyPaletteEffects(base, effects, amount)) },
      [alias]: name,
      ...(alias === 'neutral' ? { cssVariables: unownedNeutralRemaps() } : {})
    }, { track: false })
    const entry: StoredPaletteParams = isDefaultEffects(effects, amount)
      ? { ...base }
      : { ...base, effects, amount }
    setPaletteParams({ ...paletteParams.value, [alias]: entry })

    // Live drags call this at ~16Hz — one analytics event per burst is plenty.
    if (!trackedAt.value || Date.now() - trackedAt.value > 2000) {
      trackedAt.value = Date.now()
      track('Theme Custom Palette', { alias })
    }
  }

  /**
   * Drop the custom ramp and its curve params. Callers (swatch selection)
   * always set the alias right after, so no restore dance is needed — the
   * default is just a safety net for a clear without a follow-up pick.
   */
  function clearCustomPalette(alias: ColorAlias) {
    theme.removeCustomColors([customPaletteName(alias)])
    if (alias === 'neutral') {
      const remaps = unownedNeutralRemaps()
      theme.removeCSSVariables({
        light: Object.keys(remaps.light),
        dark: Object.keys(remaps.dark)
      })
    }

    theme.applyThemeSettings({ [alias]: DEFAULT_COLORS[alias] }, { track: false })

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
    theme.resetTheme({ track: false })
    style.value = deriveStyle(doc)
    if (Object.keys(style.value).length) {
      window.localStorage.setItem(THEME_STORAGE_KEYS.style, JSON.stringify(style.value))
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
    setActivePreset(preset.id)

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
        border: pick(['default', 'default', 'custom', 'none'] as const)
      }
    }

    // Colored borders/shadows and app-wide variants are the loud rolls —
    // sprinkle them in rarely enough that most shuffles stay tasteful.
    if (doc.style!.border === 'custom' && Math.random() < 0.4) {
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
    // applyDoc routes neutral through the plain setter — the shuffled
    // neutral needs the same white-literal remaps selectPalette applies,
    // or the preview diverges from the export for every tinted ramp.
    theme.applyThemeSettings({ cssVariables: unownedNeutralRemaps() }, { track: false })
    setActivePreset(undefined)

    track('Theme Studio Shuffled')
  }

  /** Palette-name chips coloring shade-slider swatches — each alias's current ramp. */
  const neutralChip = computed(() => theme.neutral.value === 'neutral' ? 'old-neutral' : theme.neutral.value)
  const primaryChip = computed(() => isCustomPalette('primary') ? 'custom-primary' : theme.primary.value)

  function rampChip(ramp: TokenRamp): string {
    if (ramp === 'primary') return primaryChip.value
    if (ramp === 'neutral') return neutralChip.value
    const name = (appConfig.ui.colors as Record<string, string>)[ramp] || ramp
    return name === 'neutral' ? 'old-neutral' : name
  }

  /* ----------------------------------------------- section reset/delta -- */

  /**
   * Dirty and reset are measured against the ACTIVE PRESET's doc (stock
   * when none): "what did I touch since applying the preset". Reset splices
   * the baseline's slice into the current doc and rides the same applyDoc
   * path history restores use.
   */
  const baselineDoc = computed(() => presets.find(preset => preset.id === activePreset.value)?.doc ?? { version: 1 as const })

  function sectionDirty(key: SectionKey) {
    return computed(() => sectionFingerprint(theme.currentDoc(), key) !== sectionFingerprint(baselineDoc.value, key))
  }

  function groupDirty(group: keyof typeof SECTION_GROUPS) {
    return computed(() => SECTION_GROUPS[group].some(key =>
      sectionFingerprint(theme.currentDoc(), key) !== sectionFingerprint(baselineDoc.value, key)
    ))
  }

  function resetSection(key: SectionKey) {
    // currentDoc embeds reactive slices — structuredClone chokes on Vue
    // proxies, so round-trip to plain JSON first (history does the same)
    const plain = JSON.parse(JSON.stringify(theme.currentDoc())) as ThemeDoc
    // applyDoc resets everything first, which clears the persisted preset —
    // but a section reset moves TOWARD the baseline; keep it
    const preserved = activePreset.value
    applyDoc(mergeSection(plain, baselineDoc.value, key))
    setActivePreset(preserved)
    track('Theme Section Reset', { section: key })
  }

  /** For flows that replace the whole doc outside a preset (imports). */
  function clearActivePreset() {
    setActivePreset(undefined)
  }

  return {
    presets,
    activePreset,
    clearActivePreset,
    sectionDirty,
    groupDirty,
    resetSection,
    style,
    setStyle,
    paletteParams,
    isCustomPalette,
    paletteShades,
    selectPalette,
    setPaletteFromCurve,
    applyDoc,
    applyPreset,
    shuffle,
    neutralChip,
    primaryChip,
    rampChip
  }
}
