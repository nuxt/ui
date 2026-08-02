/**
 * The theme system's cross-file identifiers, in one place. Only names
 * referenced from MORE than one module live here, single-file keys stay
 * local, where their context is.
 */

/** localStorage keys the studio writes and useTheme/resetTheme also touch. */
export const THEME_STORAGE_KEYS = {
  preset: 'nuxt-ui-preset',
  style: 'nuxt-ui-style',
  styleUi: 'nuxt-ui-style-ui',
  paletteParams: 'nuxt-ui-palette-params'
} as const

/** useState keys shared across composables. */
export const THEME_STATE_KEYS = {
  stylePrefs: 'nuxt-ui-style-prefs',
  themePreset: 'nuxt-ui-theme-preset',
  paletteParams: 'nuxt-ui-palette-params-state'
} as const

/** DOM ids of the style tags useHead owns and the FOUC scripts pre-fill. */
export const THEME_TAG_IDS = {
  cssVariables: 'nuxt-ui-css-variables',
  customColors: 'nuxt-ui-custom-colors'
} as const
