import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'

/**
 * Which of the studio's power-user affordances a host exposes. The full
 * studio (the docs' /theme page) runs with everything on; an embedded
 * ThemeStudioButton provides its own set so a product can hand end users
 * a curated picker — colors as a plain dropdown, no palette surgery.
 */
export interface StudioFeatures {
  /** The palette curve editor behind each color's "Edit palette" toggle. */
  palette: boolean
  /** Per-token shade sliders — "Adjust shades" and the style panel's colour fold-outs. */
  shades: boolean
  /** The Semantic section remapping secondary/success/info/warning/error. */
  semantic: boolean
  /**
   * Weight, case, tracking and leading beside each font picker. Off leaves
   * the family pickers — enough to personalise, not enough to wreck the
   * product's typography.
   */
  typography: boolean
  /** The Button/Card/Input Defaults sections (per-component variant and color). */
  components: boolean
  /** The sizing knobs: base font size, spacing density and default component size. Radius always stays. */
  scale: boolean
  /** Section-header help links into the Nuxt UI docs. */
  help: boolean
  /**
   * Reset affordances — the header button AND every section's reset-to-preset.
   * Set through ThemeStudioButton's `reset` prop; here so nested sections see it.
   */
  reset: boolean
}

export const STUDIO_FEATURE_DEFAULTS: StudioFeatures = {
  palette: true,
  shades: true,
  semantic: true,
  typography: true,
  components: true,
  scale: true,
  help: true,
  reset: true
}

const studioFeaturesKey: InjectionKey<ComputedRef<StudioFeatures>> = Symbol('theme-studio-features')

/** Host components (ThemeStudioButton) declare their feature set for every control below them. */
export function provideStudioFeatures(features: MaybeRefOrGetter<Partial<StudioFeatures>>) {
  provide(studioFeaturesKey, computed(() => ({ ...STUDIO_FEATURE_DEFAULTS, ...toValue(features) })))
}

/** Controls read the nearest host's set; no host (the docs studio) means everything on. */
export function useStudioFeatures(): ComputedRef<StudioFeatures> {
  return inject(studioFeaturesKey, () => computed(() => STUDIO_FEATURE_DEFAULTS), true)
}
