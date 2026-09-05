import type { MaybeRefOrGetter } from 'vue'
import colors from 'tailwindcss/colors'
import { rampCssName, THEME_STUDIO_VIEWS } from '../utils/theme/studio'
import type { ThemeStudioView } from '../utils/theme/studio'
// Leaf modules, never the barrel: the barrel re-exports serialize (and json5
// with it), and this composable is reached from the header preset picker on
// every docs page, which would put the exporter in the entry chunk.
import { DEFAULT_PRESET_ID, docToSettings, isDefaultTheme, styleComponents, styleTokens, DEFAULT_COLORS, SHADES, nearestShade } from '../utils/theme/engine/types'
import { presets } from '../utils/theme/engine/presets'
import { generatePalette, applyPaletteEffects, isDefaultEffects, parseCssColor } from '../utils/theme/engine/palette'
import { sectionFingerprint, stableStringify, mergeSection, canonicalTokenShades, ALL_SECTION_KEYS, SECTION_GROUPS } from '../utils/theme/engine/sections'
import type { SectionKey, ThemeDoc, ThemePreset, PaletteCurveParams, PaletteEffects, StoredPaletteParams, PalettePin, StyleOptions, Shade, ShadeStop, ColorAlias, TokenRamp, VariantGroup, DefaultVariant } from '../utils/theme/engine'

export function useThemeStudio() {
  const theme = useTheme()
  const appConfig = useAppConfig()
  const { track, trackThrottled } = useAnalytics()

  // The three studio channels are declared in useTheme with the rest of the
  // persisted state (assigned by plugins/theme.ts on the client); this
  // composable owns every write to them.

  /**
   * The BASELINE preset: stays set through ordinary edits (per-section
   * dirty/reset measures against it) and is only replaced by another
   * preset, a shuffle, an import or a full reset. Persisted so the menu
   * still names it after a reload.
   */
  const { activePreset, paletteParams, stylePrefs: style } = theme

  function setActivePreset(id: string | undefined) {
    activePreset.value = id
  }

  /**
   * Curve params per alias, kept so the editor stays editable across reloads.
   * The ramps they generate ride the customColors channel; both come out of
   * the same storage write, so they can no longer restore out of step.
   */
  function setPaletteParams(value: Partial<Record<string, StoredPaletteParams>>) {
    paletteParams.value = value
  }

  // A persisted id can name a preset that no longer exists (they get
  // renamed). The restored theme is still the visitor's; only the stale
  // baseline goes, so the pickers read Custom and dirty measures against
  // stock instead of a preset no build defines.
  if (import.meta.client && activePreset.value && !presets.some(preset => preset.id === activePreset.value)) {
    activePreset.value = undefined
  }

  function setStyle(options: StyleOptions) {
    const previousStyle = style.value
    const previous = styleTokens(previousStyle)
    // Whether the neutral remaps are in effect, read BEFORE the removal
    // below can take one of them out. Both modes are probed together: light
    // has only two remapped tokens, and a user can own both.
    const remapsActive = (['light', 'dark'] as const).some(neutralRemapsActive)
    style.value = { ...style.value, ...options }

    // Remove only the tokens the PREVIOUS style emitted and the next one
    // doesn't, never preset/doc-owned values sharing the same names.
    const tokens = styleTokens(style.value)
    const removed = {
      light: Object.keys(previous.light).filter(key => !(key in tokens.light)),
      dark: Object.keys(previous.dark).filter(key => !(key in tokens.dark))
    }
    theme.removeCSSVariables(removed)

    // A shade slider on one of the five remapped tokens had overwritten the
    // remap under the same name; resetting that slider must fall back to
    // the remap, not to the library's white literal.
    const restored = {
      light: Object.fromEntries(removed.light.filter(key => remapsActive && key in NEUTRAL_TOKEN_REMAPS.light).map(key => [key, NEUTRAL_TOKEN_REMAPS.light[key as keyof typeof NEUTRAL_TOKEN_REMAPS.light]])),
      dark: Object.fromEntries(removed.dark.filter(key => remapsActive && key in NEUTRAL_TOKEN_REMAPS.dark).map(key => [key, NEUTRAL_TOKEN_REMAPS.dark[key as keyof typeof NEUTRAL_TOKEN_REMAPS.dark]]))
    }
    if (Object.keys(restored.light).length || Object.keys(restored.dark).length) {
      theme.applyThemeSettings({ cssVariables: restored }, { track: false })
    }

    // The class bundle lives in its own channel (never touches preset/AI
    // overrides). It only reads `defaults`, so shade-only patches (every
    // slider frame) skip the double expansion entirely.
    if (options.defaults !== undefined) {
      const components = styleComponents(style.value)
      if (JSON.stringify(components) !== JSON.stringify(styleComponents(previousStyle))) {
        theme.setStyleUi(components)
      }
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
   * first, CSS variables as fallback.
   */
  function paletteShades(name: string): Partial<Record<Shade, string>> | undefined {
    const tailwind = (colors as Record<string, any>)[name]
    if (tailwind && typeof tailwind === 'object') {
      // parseCssColor throws on an absent stop, skip what a ramp leaves out.
      return Object.fromEntries(
        SHADES
          .filter(shade => tailwind[shade] != null)
          .map(shade => [shade, parseCssColor(tailwind[shade])])
          .filter(([, color]) => color)
      )
    }

    if (import.meta.client) {
      const styles = getComputedStyle(document.documentElement)
      const entries = SHADES
        .map(shade => [shade, parseCssColor(styles.getPropertyValue(`--color-${rampCssName(name)}-${shade}`))] as const)
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
    // A click on the swatch already selected is a no-op. Without this it
    // would still write the neutral remaps below, turning a stock theme
    // into a changed one. Black-as-primary is the exception: the primary
    // swatch is the way back off it.
    const current = (appConfig.ui.colors as Record<string, string>)[alias]
    if (current === name && !isCustomPalette(alias) && !(alias === 'primary' && theme.blackAsPrimary.value)) return

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
   * them. Choosing a neutral re-routes all five through the ramp, and lifts
   * the muted surface a stop: the library sits it at 50 too, so it would
   * land ON the page and every muted panel would lose its shape. The
   * presets' tintedNeutralBase carries the same six.
   */
  const NEUTRAL_TOKEN_REMAPS = {
    light: {
      '--ui-bg': 'var(--ui-color-neutral-50)',
      '--ui-bg-muted': 'var(--ui-color-neutral-100)',
      '--ui-text-inverted': 'var(--ui-color-neutral-50)'
    },
    dark: {
      '--ui-text-highlighted': 'var(--ui-color-neutral-50)',
      '--ui-bg-inverted': 'var(--ui-color-neutral-50)',
      '--ui-border-inverted': 'var(--ui-color-neutral-50)'
    }
  }

  /**
   * Whether a neutral was chosen through selectPalette: any remapped token
   * not owned by a shade slider still carries its remap value.
   */
  function neutralRemapsActive(mode: 'light' | 'dark') {
    const owned = style.value.tokenShades || {}
    const vars = theme.cssVariablesData.value[mode] || {}
    return Object.entries(NEUTRAL_TOKEN_REMAPS[mode]).some(([token, value]) => owned[token]?.[mode] === undefined && vars[token] === value)
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
   * A token shade only resolves while its ramp defines that stop. Older
   * themes could pin a token to an in-between stop (925), which no ramp emits
   * any more, so snap those to the nearest standard stop rather than leaving a
   * dangling reference (which renders transparent).
   */
  function sanitizeTokenShades() {
    const shades = style.value.tokenShades
    if (!shades) return
    let changed = false
    const next: NonNullable<StyleOptions['tokenShades']> = {}
    for (const [token, modes] of Object.entries(shades)) {
      const fixed: { light?: ShadeStop, dark?: ShadeStop } = {}
      for (const mode of ['light', 'dark'] as const) {
        const value = modes[mode]
        if (value === undefined) continue
        if (typeof value === 'number' && !SHADES.includes(value)) {
          fixed[mode] = nearestShade(value)
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
  function setPaletteFromCurve(alias: ColorAlias, base: PaletteCurveParams, effects?: PaletteEffects, amount = 100, pins: PalettePin[] = []) {
    const name = customPaletteName(alias)
    // The alias only needs pointing once. Live drags call this at ~16Hz; re-
    // sending it every tick makes applyThemeSettings re-persist the AI-extras
    // channel (a JSON.stringify + reactive wake) on every frame. Send it
    // only when it actually changes.
    const aliasAlreadySet = (appConfig.ui.colors as Record<string, string>)[alias] === name

    theme.applyThemeSettings({
      customColors: { [name]: generatePalette(applyPaletteEffects(base, effects, amount), pins) },
      ...(aliasAlreadySet ? {} : { [alias]: name }),
      // The remaps are var() references, not ramp colours, and are kept in
      // sync with the shade sliders elsewhere, so they only need (re)sending
      // when this call first points the alias at the ramp, not every tick.
      ...(alias === 'neutral' && !aliasAlreadySet ? { cssVariables: unownedNeutralRemaps() } : {})
    }, { track: false })
    const entry: StoredPaletteParams = {
      ...base,
      ...(isDefaultEffects(effects, amount) ? {} : { effects, amount }),
      ...(pins.length ? { pins } : {})
    }
    setPaletteParams({ ...paletteParams.value, [alias]: entry })

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

    sanitizeTokenShades()
  }

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
      icons: pick(theme.icons).value,
      // sans body faces only, a shuffled monospace page is never the tasteful roll
      font: { sans: pick(theme.fonts.filter(entry => entry.category === 'Sans')).name }
    }

    // A serif heading is the boldest tasteful roll the type axis has.
    if (Math.random() < 0.2) {
      doc.font!.serif = pick(theme.fonts.filter(entry => entry.category === 'Serif')).name
    }

    // Variant re-rolls are the loud ones, so each group rolls rarely and
    // independently; most shuffles restyle none, a lucky one restyles two.
    // `solid` stays off cards (an inverted, full-white panel in dark mode)
    // and off inputs (fields don't support it). Left off entirely when
    // nothing rolled, an empty `style` would ride into history and exports
    // as a phantom key.
    const variants: Partial<Record<VariantGroup, DefaultVariant>> = {}
    if (Math.random() < 0.25) variants.buttons = pick(['solid', 'outline', 'soft', 'subtle'] as const)
    if (Math.random() < 0.15) variants.inputs = pick(['soft', 'subtle', 'ghost'] as const)
    if (Math.random() < 0.1) variants.panels = pick(['soft', 'subtle'] as const)
    if (Object.keys(variants).length) {
      doc.style = { defaults: { variants } }
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
  const neutralChip = computed(() => rampCssName(theme.neutral.value))
  const primaryChip = computed(() => isCustomPalette('primary') ? customPaletteName('primary') : theme.primary.value)

  function rampChip(ramp: TokenRamp): string {
    if (ramp === 'primary') return primaryChip.value
    if (ramp === 'neutral') return neutralChip.value
    return rampCssName((appConfig.ui.colors as Record<string, string>)[ramp] || ramp)
  }

  /* ------------------------------------------------------------ preview -- */

  /** Which preview the studio shows, shared by the page and its switcher. */
  const view = useState<ThemeStudioView>('theme-studio-view', () => 'grid')

  /* ----------------------------------------------- section reset/delta -- */

  /**
   * Dirty and reset are measured against the ACTIVE PRESET's doc (stock
   * when none): "what did I touch since applying the preset". Reset splices
   * the baseline's slice into the current doc and rides the same applyDoc
   * path history restores use.
   */
  const baselineDoc = computed(() => presets.find(preset => preset.id === activePreset.value)?.doc ?? { version: 1 as const })

  // One doc build per reactive flush: every sectionDirty computed in this
  // instance reads it instead of rebuilding the doc per key.
  const liveDoc = computed(() => theme.currentDoc())

  /**
   * One key, or several when a control owns more than one slice. Takes a
   * getter too, so a component can hand over its prop and keep the flag
   * following it.
   */
  function sectionDirty(key: MaybeRefOrGetter<SectionKey | SectionKey[] | undefined>) {
    return computed(() => {
      const value = toValue(key)
      if (!value) return false
      const keys = Array.isArray(value) ? value : [value]
      return keys.some(entry =>
        sectionFingerprint(liveDoc.value, entry) !== sectionFingerprint(baselineDoc.value, entry)
      )
    })
  }

  function groupDirty(group: keyof typeof SECTION_GROUPS) {
    return computed(() => SECTION_GROUPS[group].some(key =>
      sectionFingerprint(liveDoc.value, key) !== sectionFingerprint(baselineDoc.value, key)
    ))
  }

  /**
   * Anything diverging from the baseline, measured the way the sections
   * measure it (a preset's ramp-shaped token and the shade applyDoc promoted
   * it into compare equal), plus the component overrides no section owns:
   * the AI chat writes them, and they are edits all the same.
   */
  const dirty = computed(() =>
    ALL_SECTION_KEYS.some(key => sectionFingerprint(liveDoc.value, key) !== sectionFingerprint(baselineDoc.value, key))
    || stableStringify(liveDoc.value.components ?? null) !== stableStringify(baselineDoc.value.components ?? null)
  )

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
    return theme.hasChanges.value ? undefined : DEFAULT_PRESET_ID
  })

  return {
    presets,
    activePreset,
    selectedPreset,
    baselineDoc,
    clearActivePreset,
    sectionDirty,
    groupDirty,
    dirty,
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
    clearCustomPalette,
    shuffle,
    neutralChip,
    primaryChip,
    rampChip,
    view,
    views: THEME_STUDIO_VIEWS
  }
}
