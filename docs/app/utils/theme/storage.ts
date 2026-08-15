import type { ThemeDoc, StoredPaletteParams, StyleOptions } from './engine'

/** Typography beyond the base family. */
export interface FontPrefs {
  weights?: { normal?: number, medium?: number, semibold?: number, bold?: number }
  uppercase?: boolean
  italic?: boolean
  /** Tracking in em. */
  letterSpacing?: number
  /** Unitless line height, 1.5 is the tailwind preflight default. */
  lineHeight?: number
  heading?: { font?: string, weight?: number, uppercase?: boolean, italic?: boolean, underline?: boolean, letterSpacing?: number, lineHeight?: number }
}

/**
 * The theme's single persisted key. Every setting used to own a localStorage
 * key of its own, which meant restores could interleave: the derived stores
 * (the ramp behind a custom palette, the class bundle behind a style) could
 * come back without the source that produced them, so each needed a self-heal
 * to reconcile. One key writes atomically, so those states cannot disagree.
 *
 * Not a ThemeDoc: the doc is the EXPORT shape, diffed against a stock library
 * install. This is a snapshot of runtime state, and hydrating it has to
 * distribute values in a specific order (colors before paint, icons after
 * hydration, see plugins/theme.ts). `currentDoc()` still derives the doc from
 * this state whenever an export, a preset diff or a history entry needs one.
 */
export const THEME_STORAGE_KEY = 'nuxt-ui-theme'

export interface StoredTheme {
  primary?: string
  neutral?: string
  radius?: number
  fontSize?: number
  spacing?: number
  font?: string
  icons?: string
  blackAsPrimary?: boolean
  fontPrefs?: FontPrefs
  /** Semantic alias overrides (secondary, success, info, warning, error). */
  colors?: Record<string, string>
  /** Explicit per-component overrides, from presets, imports or the AI chat. */
  components?: Record<string, Record<string, unknown>>
  customColors?: Record<string, Record<string, string>>
  cssVariables?: { light?: Record<string, string>, dark?: Record<string, string> }
  style?: StyleOptions
  /** The palette editor's curves and pins, the source the ramps derive from. */
  paletteParams?: Partial<Record<string, StoredPaletteParams>>
  /** The preset the per-section dirty and reset comparisons measure against. */
  preset?: string
}

/**
 * The keys the shipped theme picker wrote before this became one key. Only
 * the nine that are live on v4 today, the studio's own (style, palette
 * params, preset) never shipped and are not worth carrying.
 *
 * vueuse's `useLocalStorage` writes strings and numbers RAW, not JSON, so
 * these read back per type rather than through JSON.parse.
 */
const LEGACY_KEYS = [
  'nuxt-ui-primary', 'nuxt-ui-neutral', 'nuxt-ui-radius', 'nuxt-ui-font-size',
  'nuxt-ui-spacing', 'nuxt-ui-font', 'nuxt-ui-icons', 'nuxt-ui-black-as-primary',
  'nuxt-ui-font-prefs', 'nuxt-ui-ai-theme', 'nuxt-ui-custom-colors', 'nuxt-ui-css-variables'
]

function migrateLegacyTheme(): StoredTheme {
  const read = (key: string) => window.localStorage.getItem(key) ?? undefined
  const number = (key: string) => {
    const value = Number.parseFloat(read(key) ?? '')
    return Number.isFinite(value) ? value : undefined
  }
  const json = <T>(key: string): T | undefined => {
    try {
      const raw = read(key)
      return raw ? JSON.parse(raw) as T : undefined
    } catch {
      return undefined
    }
  }

  const extras = json<{ colors?: Record<string, string>, ui?: Record<string, Record<string, unknown>> }>('nuxt-ui-ai-theme')
  const migrated: StoredTheme = {
    primary: read('nuxt-ui-primary'),
    neutral: read('nuxt-ui-neutral'),
    radius: number('nuxt-ui-radius'),
    fontSize: number('nuxt-ui-font-size'),
    spacing: number('nuxt-ui-spacing'),
    font: read('nuxt-ui-font'),
    icons: read('nuxt-ui-icons'),
    blackAsPrimary: read('nuxt-ui-black-as-primary') === 'true' || undefined,
    fontPrefs: json('nuxt-ui-font-prefs'),
    colors: extras?.colors,
    components: extras?.ui,
    customColors: json('nuxt-ui-custom-colors'),
    cssVariables: json('nuxt-ui-css-variables')
  }

  // Written back under the new key and the old ones dropped, so this runs
  // exactly once per browser rather than on every load.
  writeStoredTheme(migrated)
  LEGACY_KEYS.forEach(key => window.localStorage.removeItem(key))
  return migrated
}

/** Never throws: a corrupt or absent key reads as "no saved theme". */
export function readStoredTheme(): StoredTheme {
  if (!import.meta.client) return {}
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (!raw) {
      return LEGACY_KEYS.some(key => window.localStorage.getItem(key) !== null)
        ? migrateLegacyTheme()
        : {}
    }
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed as StoredTheme : {}
  } catch {
    return {}
  }
}

/** An empty theme removes the key rather than storing `{}`. */
export function writeStoredTheme(value: StoredTheme) {
  if (!import.meta.client) return
  const entries = Object.entries(value).filter(([, entry]) => {
    if (entry === undefined) return false
    if (entry && typeof entry === 'object') return Object.keys(entry).length > 0
    return true
  })
  if (entries.length) {
    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)))
  } else {
    window.localStorage.removeItem(THEME_STORAGE_KEY)
  }
}

/** Doc type re-exported so consumers don't reach past this module for it. */
export type { ThemeDoc }

/* ------------------------------------------------- shared identifiers -- */

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
