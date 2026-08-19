import colors from 'tailwindcss/colors'
import { THEME_STATE_KEYS, readStoredTheme } from '../utils/theme/storage'
import { presets, DEFAULT_PRESET_ID, docToSettings, isDefaultTheme, generatePalette, applyPaletteEffects, isDefaultEffects, parseCssColor, styleComponents, styleTokens, sectionFingerprint, mergeSection, canonicalTokenShades, storedStopStep, nearestShade, TOKEN_SHADE_TARGETS, SECTION_GROUPS, DEFAULT_COLORS, SHADES, SHADES_ALL, SHADE_SETS } from '../utils/theme/engine'
import type { SectionKey, ThemeDoc, ThemePreset, PaletteCurveParams, PaletteEffects, StoredPaletteParams, PalettePin, StyleOptions, Shade, ShadeStep, ShadeStop, ColorAlias, TokenRamp } from '../utils/theme/engine'

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
  const activePreset = useState<string | undefined>(THEME_STATE_KEYS.themePreset, () => {
    // Presets get renamed, so a persisted id can stop naming anything. Drop it
    // rather than holding a baseline no preset defines, which would leave the
    // pickers with nothing selected and every section reading dirty forever.
    // assigned by plugins/theme.ts on the client, defaults on the server
    return undefined
  })

  function setActivePreset(id: string | undefined) {
    activePreset.value = id
  }

  /**
   * Curve params per alias, kept so the editor stays editable across reloads.
   * The ramps they generate ride the customColors channel; both come out of
   * the same storage write, so they can no longer restore out of step.
   */
  const paletteParams = useState<Partial<Record<string, StoredPaletteParams>>>(THEME_STATE_KEYS.paletteParams, () => ({}))

  function setPaletteParams(value: Partial<Record<string, StoredPaletteParams>>) {
    paletteParams.value = value
  }

  // A persisted id can name a preset that no longer exists (they get renamed).
  // The theme it applied is still restored, so the page would keep a look no
  // preset can name and every picker would read Custom. Reset to stock: the
  // doc came from a build that no longer exists, so there is nothing to
  // preserve it against. This discards edits made on top of a since-renamed
  // preset, the trade for the pickers and the page agreeing.
  const presetHealed = useState('nuxt-ui-preset-healed', () => false)
  if (import.meta.client && !presetHealed.value) {
    presetHealed.value = true
    const id = readStoredTheme().preset
    if (id && !presets.some(preset => preset.id === id)) {
      onNuxtReady(() => theme.resetTheme({ track: false }))
    }
  }

  /** Default-variant and token-shade prefs; the expansion lives in the style-ui channel. */
  const style = useState<StyleOptions>(THEME_STATE_KEYS.stylePrefs, () => ({}))

  // The class bundle is an expansion of `style`, not stored state, so it is
  // rebuilt from the restored prefs on load. That also means a generator
  // change (new fragment classes) reaches already-saved themes for free,
  // which used to need a self-heal comparing the two.
  const bundleBuilt = useState('nuxt-ui-style-bundle-built', () => false)
  if (import.meta.client && !bundleBuilt.value) {
    bundleBuilt.value = true
    try {
      const expected = styleComponents(style.value)
      if (Object.keys(expected).length) onNuxtReady(() => theme.setStyleUi(expected))
    } catch {
      // a throwing expansion (corrupt persisted style) shouldn't be permanent
      bundleBuilt.value = false
    }
  }

  // Shared across composable instances so the analytics throttle holds no
  // matter which component fires the event.
  const trackedAt = useState<number | undefined>('nuxt-ui-style-tracked-at', () => undefined)

  // Style and palette edits share one clock deliberately: a drag session
  // is one gesture, not two metrics.
  function trackThrottled(...args: Parameters<typeof track>) {
    if (!trackedAt.value || Date.now() - trackedAt.value > 2000) {
      trackedAt.value = Date.now()
      track(...args)
    }
  }

  function setStyle(options: StyleOptions) {
    const previousStyle = style.value
    const previous = styleTokens(previousStyle)
    style.value = { ...style.value, ...options }

    // Remove only the tokens the PREVIOUS style emitted and the next one
    // doesn't, never preset/doc-owned values sharing the same names.
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

    // Sliders stream through here at drag frequency, one event per burst.
    trackThrottled('Theme Style Changed', {
      variant: style.value.defaults?.variant || 'default',
      size: style.value.defaults?.size || 'default'
    })
  }

  function customPaletteName(alias: string) {
    return `custom-${alias}`
  }

  function isCustomPalette(alias: string) {
    return (appConfig.ui.colors as Record<string, string>)[alias] === customPaletteName(alias)
  }

  /**
   * Every defined shade of a named palette as oklch, tailwind's JS values
   * first, CSS variables as fallback. Sampled across every stop any density
   * can emit, so a ramp generated at a finer density is read whole; a standard
   * 11-stop ramp simply has no in-between vars and those drop out. The editor
   * reads the density back from which stops came through.
   */
  function paletteShades(name: string): Partial<Record<Shade, string>> | undefined {
    const tailwind = (colors as Record<string, any>)[name]
    if (tailwind && typeof tailwind === 'object') {
      // A stock tailwind ramp has only the 11 standard stops, the rest are
      // undefined, and parseCssColor would throw on those. Skip absent shades
      // so a full sweep degrades cleanly to the 11 present.
      return Object.fromEntries(
        SHADES_ALL
          .filter(shade => tailwind[shade] != null)
          .map(shade => [shade, parseCssColor(tailwind[shade])])
          .filter(([, color]) => color)
      )
    }

    if (import.meta.client) {
      const styles = getComputedStyle(document.documentElement)
      const cssName = name === 'neutral' ? 'old-neutral' : name
      const entries = SHADES_ALL
        .map(shade => [shade, parseCssColor(styles.getPropertyValue(`--color-${cssName}-${shade}`))] as const)
        .filter(([, color]) => color)
      if (entries.length >= 2) {
        return Object.fromEntries(entries)
      }
    }
    return undefined
  }

  /**
   * Swatch-click entry point, for any color alias, always a real alias
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
      // Stock neutrals need the white-literal remaps too, without them the
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
   * them. Choosing a neutral re-routes all five through the ramp, which is
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

  /** The stops a ramp actually emits, its density when custom, else the standard 11. */
  function rampStops(ramp?: string): readonly Shade[] {
    return ramp && isCustomPalette(ramp) ? SHADE_SETS[storedStopStep(paletteParams.value[ramp])] : SHADES
  }

  /**
   * A token shade pinned to an in-between stop only resolves while its ramp is
   * a custom palette generating that stop, that's the only thing defining
   * `--color-custom-<ramp>-<stop>`. When a ramp changes density, or is cleared
   * / switched to a stock colour, that variable disappears, so snap any
   * now-orphaned token to the nearest stop the ramp does emit rather than
   * leaving a dangling reference (which renders transparent).
   */
  function sanitizeTokenShades() {
    const shades = style.value.tokenShades
    if (!shades) return
    let changed = false
    const next: NonNullable<StyleOptions['tokenShades']> = {}
    for (const [token, modes] of Object.entries(shades)) {
      const stops = rampStops(TOKEN_SHADE_TARGETS.find(target => target.token === token)?.ramp)
      const fixed: { light?: ShadeStop, dark?: ShadeStop } = {}
      for (const mode of ['light', 'dark'] as const) {
        const value = modes[mode]
        if (value === undefined) continue
        if (typeof value === 'number' && !stops.includes(value)) {
          fixed[mode] = nearestShade(value, stops)
          changed = true
        } else {
          fixed[mode] = value
        }
      }
      if (Object.keys(fixed).length) next[token] = fixed
    }
    if (changed) setStyle({ tokenShades: next })
  }

  /**
   * Generate a ramp and point the alias at it. The base curves and the
   * modifier lens persist separately, so a reload restores the editor's
   * sliders instead of silently baking them into the curves.
   */
  function setPaletteFromCurve(alias: ColorAlias, base: PaletteCurveParams, effects?: PaletteEffects, amount = 100, step: ShadeStep = 100, pins: PalettePin[] = []) {
    const name = customPaletteName(alias)
    // The alias only needs pointing once. Live drags call this at ~16Hz; re-
    // sending it every tick makes applyThemeSettings re-persist the AI-extras
    // channel (a JSON.stringify + reactive wake) on every frame. Send it
    // only when it actually changes.
    const aliasAlreadySet = (appConfig.ui.colors as Record<string, string>)[alias] === name

    theme.applyThemeSettings({
      customColors: { [name]: generatePalette(applyPaletteEffects(base, effects, amount), step, pins) },
      ...(aliasAlreadySet ? {} : { [alias]: name }),
      // The remaps are var() references, not ramp colours, and are kept in
      // sync with the shade sliders elsewhere, so they only need (re)sending
      // when this call first points the alias at the ramp, not every tick.
      ...(alias === 'neutral' && !aliasAlreadySet ? { cssVariables: unownedNeutralRemaps() } : {})
    }, { track: false })
    const entry: StoredPaletteParams = {
      ...base,
      ...(isDefaultEffects(effects, amount) ? {} : { effects, amount }),
      ...(step !== 100 ? { stopStep: step } : {}),
      ...(pins.length ? { pins } : {})
    }
    setPaletteParams({ ...paletteParams.value, [alias]: entry })

    // A coarser density orphans any token pinned to a stop it no longer emits.
    // Only writes when something actually moved, so the drag path is a no-op.
    sanitizeTokenShades()

    // Live drags call this at ~16Hz, one analytics event per burst is plenty.
    trackThrottled('Theme Custom Palette', { alias })
  }

  /**
   * Drop the custom ramp and its curve params. Callers (swatch selection)
   * always set the alias right after, so no restore dance is needed, the
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

    // A stock ramp emits only the standard 11, snap any token off the rest.
    sanitizeTokenShades()
  }

  /**
   * Reflect a doc's token overrides back into the sidebar's shade settings
   * where they are representable, so controls show the preset's reality
   * instead of stale defaults. Only neutral-ramp refs map onto sliders;
   * anything else (white/black literals, non-neutral refs) stays token-only.
   */
  /**
   * The style axis a doc implies: its explicit style plus ramp-shaped token
   * overrides promoted into tokenShades (canonicalTokenShades, shared with
   * the section dirty/reset comparisons, which depend on this promotion
   * being identical on both sides).
   */
  function deriveStyle(doc: ThemeDoc): StyleOptions {
    const derived: StyleOptions = { ...(doc.style || {}) }
    const shades = canonicalTokenShades(doc)
    // guard: an empty tokenShades object would flip isDefaultStyle
    if (Object.keys(shades).length) derived.tokenShades = shades
    return derived
  }

  /** Replace the current theme with a document: reset, then apply overrides. */
  function applyDoc(doc: ThemeDoc) {
    // immediate: false, this reset is followed by the doc's own styles in the
    // same call, so let the reactive tags swap atomically rather than clearing
    // to the default theme for a frame (a white flash between presets).
    theme.resetTheme({ track: false, immediate: false })
    style.value = deriveStyle(doc)

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
      font: { sans: pick(theme.fonts) }
    }

    // An app-wide variant is the loud roll, sprinkled in rarely enough that
    // most shuffles stay tasteful. Left off entirely otherwise, an empty
    // `style` would ride into history and exports as a phantom key.
    if (Math.random() < 0.25) {
      doc.style = { defaults: { variant: pick(['solid', 'outline', 'soft', 'subtle'] as const) } }
    }

    if (Math.random() < 0.125) {
      doc.blackAsPrimary = true
      delete doc.colors!.primary
    }

    applyDoc(doc)
    // applyDoc routes neutral through the plain setter, the shuffled
    // neutral needs the same white-literal remaps selectPalette applies,
    // or the preview diverges from the export for every tinted ramp.
    theme.applyThemeSettings({ cssVariables: unownedNeutralRemaps() }, { track: false })
    setActivePreset(undefined)

    track('Theme Studio Shuffled')
  }

  /** Palette-name chips coloring shade-slider swatches, each alias's current ramp. */
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

  /** One key, or several when a fold owns more than one slice (Defaults). */
  function sectionDirty(key: SectionKey | SectionKey[]) {
    const keys = Array.isArray(key) ? key : [key]
    return computed(() => keys.some(entry =>
      sectionFingerprint(theme.currentDoc(), entry) !== sectionFingerprint(baselineDoc.value, entry)
    ))
  }

  function groupDirty(group: keyof typeof SECTION_GROUPS) {
    return computed(() => SECTION_GROUPS[group].some(key =>
      sectionFingerprint(theme.currentDoc(), key) !== sectionFingerprint(baselineDoc.value, key)
    ))
  }

  function resetSection(key: SectionKey | SectionKey[]) {
    // several slices splice in one pass, one applyDoc, so a multi-key fold
    // costs one history entry rather than one per slice
    const keys = Array.isArray(key) ? key : [key]
    // currentDoc embeds reactive slices, structuredClone chokes on Vue
    // proxies, so round-trip to plain JSON first (history does the same)
    const plain = JSON.parse(JSON.stringify(theme.currentDoc())) as ThemeDoc
    // applyDoc resets everything first, which clears the persisted preset,
    // but a section reset moves TOWARD the baseline; keep it
    const preserved = activePreset.value
    // applyDoc wipes the editor curves too, but a section reset only touches its
    // own slice, restore curves for any alias whose custom ramp outlived it
    // (a reset colour section drops to a stock name, so isCustomPalette filters
    // it out) or the editor would silently refit the untouched ramp.
    const preservedPp = JSON.parse(JSON.stringify(paletteParams.value)) as typeof paletteParams.value
    applyDoc(keys.reduce((doc, entry) => mergeSection(doc, baselineDoc.value, entry), plain))
    setPaletteParams(Object.fromEntries(
      Object.entries(preservedPp).filter(([alias]) => isCustomPalette(alias))
    ))
    setActivePreset(preserved)
    track('Theme Section Reset', { section: keys.join(',') })
  }

  /** For flows that replace the whole doc outside a preset (imports). */
  function clearActivePreset() {
    setActivePreset(undefined)
  }

  /**
   * The preset the pickers show as selected. An untouched theme IS the stock
   * preset, so it reads as Default rather than as nothing selected; once
   * edits diverge with no preset behind them there's nothing to point at
   * (the menu calls that 'Custom').
   */
  const selectedPreset = computed(() => {
    if (activePreset.value) return activePreset.value
    return (theme.hasCSSChanges.value || theme.hasConfigChanges.value) ? undefined : DEFAULT_PRESET_ID
  })

  return {
    presets,
    activePreset,
    selectedPreset,
    baselineDoc,
    clearActivePreset,
    sectionDirty,
    groupDirty,
    resetSection,
    style,
    setStyle,
    paletteParams,
    setPaletteParams,
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
