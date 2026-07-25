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
  /** Section-header help links into the Nuxt UI docs. */
  help: boolean
}

export const STUDIO_FEATURE_DEFAULTS: StudioFeatures = {
  palette: true,
  shades: true,
  semantic: true,
  help: true
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
