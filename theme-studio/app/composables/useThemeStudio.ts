import colors from 'tailwindcss/colors'
import { THEME_STATE_KEYS, themeStorageKeys } from '../utils/theme-keys'
import { presets, docToSettings, isDefaultTheme, generatePalette, applyPaletteEffects, isDefaultEffects, parseCssColor, styleComponents, styleTokens, sectionFingerprint, mergeSection, canonicalTokenShades, storedStopStep, nearestShade, TOKEN_SHADE_TARGETS, SECTION_GROUPS, DEFAULT_COLORS, SHADES, SHADES_ALL, SHADE_SETS } from '../utils/theme-engine'
import type { SectionKey, ThemeDoc, ThemePreset, PaletteCurveParams, PaletteEffects, StoredPaletteParams, PalettePin, StyleOptions, Shade, ShadeStep, ShadeStop, ColorAlias, TokenRamp } from '../utils/theme-engine'
import { readLocalStorage } from '../utils/theme'

export function useThemeStudio() {
  const theme = useTheme()
  const appConfig = useAppConfig()
  const { track } = useAnalytics()
  const storageKeys = themeStorageKeys()

  /**
   * The BASELINE preset: stays set through ordinary edits (per-section
   * dirty/reset measures against it) and is only replaced by another
   * preset, a shuffle, an import or a full reset. Persisted so the menu
   * still names it after a reload.
   */
  const activePreset = useState<string | undefined>(THEME_STATE_KEYS.themePreset, () => readLocalStorage(storageKeys.preset, undefined))

  function setActivePreset(id: string | undefined) {
    activePreset.value = id
    if (!import.meta.client) return
    if (id) {
      window.localStorage.setItem(storageKeys.preset, JSON.stringify(id))
    } else {
      window.localStorage.removeItem(storageKeys.preset)
    }
  }

  /**
   * Curve params per alias, kept so the editor stays editable across
   * reloads. useState + explicit persistence (not useLocalStorage) so
   * resetTheme() — reachable from the popover and chat, outside this
   * composable — can clear the shared state, not just the storage key.
   */
  const paletteParams = useState<Partial<Record<string, StoredPaletteParams>>>(THEME_STATE_KEYS.paletteParams, () => readLocalStorage(storageKeys.paletteParams, {}))

  function setPaletteParams(value: Partial<Record<string, StoredPaletteParams>>) {
    paletteParams.value = value
    if (Object.keys(value).length) {
      window.localStorage.setItem(storageKeys.paletteParams, JSON.stringify(value))
    } else {
      window.localStorage.removeItem(storageKeys.paletteParams)
    }
  }

  /** Shadow/border/token-shade prefs; the expanded class bundle lives in the style-ui channel. */
  const style = useState<StyleOptions>(THEME_STATE_KEYS.stylePrefs, () => readLocalStorage(storageKeys.style, {}))

  // Self-heal: the persisted class bundle is an expansion of `style` frozen
  // at write time — if the generator changed since (new fragment classes),
  // regenerate it once so stale classes don't outlive their source. Guarded
  // so the dozens of components calling this composable check only once.
  const healed = useState('nuxt-ui-style-healed', () => false)
  if (import.meta.client && !healed.value) {
    healed.value = true
    try {
      const expected = styleComponents(style.value)
      if (JSON.stringify(expected) !== JSON.stringify(readLocalStorage(storageKeys.styleUi, {}))) {
        onNuxtReady(() => theme.setStyleUi(expected))
      }
    } catch {
      // A throwing expansion (corrupt persisted style) shouldn't permanently
      // disable healing — retry on the next load.
      healed.value = false
    }
  }

  // Self-heal custom palettes. A custom ramp lives in three stores that
  // restore independently on reload: the editor curves (paletteParams), the
  // derived ramp (custom-colors) and the alias mapping. The derived stores
  // ride useState, which hydrates from an empty SSR payload — so a lost
  // restore race can leave the preview on a stale/absent ramp while the
  // editor still shows the curves (and their modifiers). The curves are the
  // source of truth: re-derive each persisted palette once on load, after the
  // plugin restore, so the preview is rebuilt from them and always matches
  // the editor. Re-deriving is idempotent, so healing a correct load is a
  // harmless no-op write — cheaper than trusting a possibly-stale render.
  const palettesHealed = useState('nuxt-ui-palettes-healed', () => false)
  if (import.meta.client && !palettesHealed.value) {
    palettesHealed.value = true
    onNuxtReady(() => {
      for (const [alias, reactiveEntry] of Object.entries(paletteParams.value)) {
        if (!reactiveEntry || !('lightness' in reactiveEntry)) continue
        // Deep-unwrap the reactive useState proxy to a plain object — the curve
        // params flow into applyPaletteEffects, which structuredClones them,
        // and a reactive proxy can't be cloned. Curves are pure numbers, so a
        // JSON round-trip is a lossless plain copy.
        const entry = JSON.parse(JSON.stringify(reactiveEntry)) as StoredPaletteParams
        // The modifier lens bakes into the ramp here exactly as it did at edit
        // time, so restoring the curves restores the modifiers' effect too.
        const ramp = generatePalette(applyPaletteEffects(
          { lightness: entry.lightness, chroma: entry.chroma, hue: entry.hue },
          entry.effects,
          entry.amount
        ), storedStopStep(entry), entry.pins)
        const name = customPaletteName(alias)
        // Only the derived ramp (customColors) loses its restore race. Re-sending
        // an already-correct alias routes through the primary/neutral setters,
        // which reset black-as-primary and fire a spurious event every load — so
        // heal the ramp always, touch the alias only if it drifted.
        const aliasAlreadySet = (appConfig.ui.colors as Record<string, string>)[alias] === name
        theme.applyThemeSettings({
          customColors: { [name]: ramp },
          ...(aliasAlreadySet ? {} : { [alias]: name }),
          ...(alias === 'neutral' && !aliasAlreadySet ? { cssVariables: unownedNeutralRemaps() } : {})
        }, { track: false })
      }
    })
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
    window.localStorage.setItem(storageKeys.style, JSON.stringify(style.value))
    // The .shadow-custom root flag is kept in sync by a watcher in plugins/theme.ts
    // (covers presets via applyDoc too), so no per-path toggle is needed here.

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
    trackThrottled('Theme Style Changed', {
      shadow: style.value.shadow || 'none',
      border: style.value.border || 'default',
      borderColor: style.value.borderColor || 'default',
      shadowColor: style.value.shadowColor || 'default'
    })
  }

  function customPaletteName(alias: string) {
    return `custom-${alias}`
  }

  function isCustomPalette(alias: string) {
    return (appConfig.ui.colors as Record<string, string>)[alias] === customPaletteName(alias)
  }

  /**
   * Every defined shade of a named palette as oklch — tailwind's JS values
   * first, CSS variables as fallback. Sampled across every stop any density
   * can emit, so a ramp generated at a finer density is read whole; a standard
   * 11-stop ramp simply has no in-between vars and those drop out. The editor
   * reads the density back from which stops came through.
   */
  function paletteShades(name: string): Partial<Record<Shade, string>> | undefined {
    const tailwind = (colors as Record<string, any>)[name]
    if (tailwind && typeof tailwind === 'object') {
      // A stock tailwind ramp has only the 11 standard stops — the rest are
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

  /** The stops a ramp actually emits — its density when custom, else the standard 11. */
  function rampStops(ramp?: string): readonly Shade[] {
    return ramp && isCustomPalette(ramp) ? SHADE_SETS[storedStopStep(paletteParams.value[ramp])] : SHADES
  }

  /**
   * A token shade pinned to an in-between stop only resolves while its ramp is
   * a custom palette generating that stop — that's the only thing defining
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
    // channel (a JSON.stringify + localStorage write) on every frame. Send it
    // only when it actually changes.
    const aliasAlreadySet = (appConfig.ui.colors as Record<string, string>)[alias] === name

    theme.applyThemeSettings({
      customColors: { [name]: generatePalette(applyPaletteEffects(base, effects, amount), step, pins) },
      ...(aliasAlreadySet ? {} : { [alias]: name }),
      // The remaps are var() references, not ramp colours, and are kept in
      // sync with the shade sliders elsewhere — so they only need (re)sending
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

    // Live drags call this at ~16Hz — one analytics event per burst is plenty.
    trackThrottled('Theme Custom Palette', { alias })
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

    // A stock ramp emits only the standard 11 — snap any token off the rest.
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
   * overrides promoted into tokenShades (canonicalTokenShades — shared with
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
    // immediate: false — this reset is followed by the doc's own styles in the
    // same call, so let the reactive tags swap atomically rather than clearing
    // to the default theme for a frame (a white flash between presets).
    theme.resetTheme({ track: false, immediate: false })
    style.value = deriveStyle(doc)
    if (Object.keys(style.value).length) {
      window.localStorage.setItem(storageKeys.style, JSON.stringify(style.value))
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
        ...(Math.random() < 0.5 ? { shadow: 'custom' as const } : {}),
        border: pick(['default', 'default', 'custom', 'none'] as const)
      }
    }

    // Colored borders/shadows and app-wide variants are the loud rolls —
    // sprinkle them in rarely enough that most shuffles stay tasteful.
    if (doc.style!.border === 'custom' && Math.random() < 0.4) {
      doc.style!.borderColor = pick(['inverted', 'primary', 'neutral'] as const)
    }
    if (doc.style!.shadow === 'custom') {
      // One config shadow: roll its geometry between a crisp offset (hard) and a
      // soft blur, plus an occasional coloured cast.
      const crisp = Math.random() < 0.5
      doc.style!.shadowGeometry = crisp ? { x: 3, y: 3, blur: 0, spread: 0 } : { x: 0, y: 6, blur: 12, spread: 0 }
      doc.style!.shadowOpacity = crisp ? 100 : 25
      if (Math.random() < 0.4) doc.style!.shadowColor = pick(['black', 'inverted', 'primary'] as const)
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
    // applyDoc wipes the editor curves too, but a section reset only touches its
    // own slice — restore curves for any alias whose custom ramp outlived it
    // (a reset colour section drops to a stock name, so isCustomPalette filters
    // it out) or the editor would silently refit the untouched ramp.
    const preservedPp = JSON.parse(JSON.stringify(paletteParams.value)) as typeof paletteParams.value
    applyDoc(mergeSection(plain, baselineDoc.value, key))
    setPaletteParams(Object.fromEntries(
      Object.entries(preservedPp).filter(([alias]) => isCustomPalette(alias))
    ))
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
