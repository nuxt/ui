/**
 * The theme system's cross-file identifiers, in one place. Only names
 * referenced from MORE than one module live here — single-file keys stay
 * local, where their context is.
 */

/** Fallback prefix — also the layer's runtimeConfig default. */
export const THEME_STORAGE_PREFIX = 'nuxt-ui'

// localStorage keys are the only origin-wide names the studio owns, so they
// are the only ones a consumer can need to scope. `nuxt-ui` keeps them safe
// to inline into the FOUC scripts' JS source.
const SAFE_PREFIX = /^[\w-]{1,50}$/

/**
 * The consumer's localStorage namespace, from
 * `runtimeConfig.public.themeStudio.storageKey`. Sanitized HERE so every
 * caller — including the generated FOUC scripts — agrees on one value.
 */
export function themeStoragePrefix(): string {
  const configured = useRuntimeConfig().public.themeStudio?.storageKey
  if (!configured) return THEME_STORAGE_PREFIX
  if (!SAFE_PREFIX.test(configured)) {
    if (import.meta.dev) console.warn(`[theme-studio] ignoring themeStudio.storageKey "${configured}" — expected /${SAFE_PREFIX.source}/`)
    return THEME_STORAGE_PREFIX
  }
  return configured
}

/**
 * localStorage keys the studio writes and useTheme/resetTheme also touch,
 * namespaced by the consuming app. Read once per composable/plugin call —
 * never cache across apps.
 */
export function themeStorageKeys() {
  const prefix = themeStoragePrefix()
  return {
    radius: `${prefix}-radius`,
    fontSize: `${prefix}-font-size`,
    spacing: `${prefix}-spacing`,
    font: `${prefix}-font`,
    fontPrefs: `${prefix}-font-prefs`,
    blackAsPrimary: `${prefix}-black-as-primary`,
    primary: `${prefix}-primary`,
    neutral: `${prefix}-neutral`,
    icons: `${prefix}-icons`,
    aiTheme: `${prefix}-ai-theme`,
    styleUi: `${prefix}-style-ui`,
    customColors: `${prefix}-custom-colors`,
    cssVariables: `${prefix}-css-variables`,
    preset: `${prefix}-preset`,
    style: `${prefix}-style`,
    paletteParams: `${prefix}-palette-params`
  }
}

/**
 * useState keys shared across composables. NOT namespaced — useState is
 * per-Nuxt-app, so these can't collide across apps on one origin. Several
 * mirror a storage key whose name now differs: the pairing lives here.
 */
export const THEME_STATE_KEYS = {
  stylePrefs: 'nuxt-ui-style-prefs',
  themePreset: 'nuxt-ui-theme-preset',
  paletteParams: 'nuxt-ui-palette-params-state',
  aiTheme: 'nuxt-ui-ai-theme',
  styleUi: 'nuxt-ui-style-ui',
  customColors: 'nuxt-ui-custom-colors',
  cssVariables: 'nuxt-ui-css-variables',
  fontPrefs: 'nuxt-ui-font-prefs'
} as const

/** DOM ids of the style tags useHead owns and the FOUC scripts pre-fill. */
export const THEME_TAG_IDS = {
  cssVariables: 'nuxt-ui-css-variables',
  customColors: 'nuxt-ui-custom-colors'
} as const
