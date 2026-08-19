import type { ThemeDoc, StoredPaletteParams, StyleOptions } from './engine'
import { THEME_DEFAULTS } from './engine'

/**
 * The font document: all three stacks plus the body treatment, exactly the
 * doc's own shape. It used to be this type minus `sans`, because the sans
 * shipped as its own `nuxt-ui-font` key long before the rest existed and the
 * two never got folded back together.
 */
export type FontPrefs = NonNullable<ThemeDoc['font']>

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
  icons?: string
  blackAsPrimary?: boolean
  font?: FontPrefs
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
 * Every key the theme picker wrote before this became one key: the nine that
 * are live on v4 today plus three this branch added (font size, spacing and
 * the typography bag). The studio's own (style, palette params, preset) never
 * left the branch and are not worth carrying.
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
    icons: read('nuxt-ui-icons'),
    blackAsPrimary: read('nuxt-ui-black-as-primary') === 'true' || undefined,
    // the family and the rest of the typography were two keys back then
    font: normalizeFont({ ...json<Record<string, unknown>>('nuxt-ui-font-prefs'), sans: read('nuxt-ui-font') }),
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

const SAFE_FONT = /^[\w -]{1,50}$/

/** Clamp to a range, or drop the value if it isn't a finite number. */
function clamped(value: unknown, min: number, max: number): number | undefined {
  const number = Number(value)
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : undefined
}

/**
 * Restores bypass `setFontPrefs`, so this is where a stored font document is
 * made to satisfy the same invariants: no unusable family name, no
 * out-of-range number, and no explicitly-stock family (which would otherwise
 * read as a change forever, keeping the reset button lit).
 */
function normalizeFont(raw: unknown): FontPrefs | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const input = raw as Record<string, any>
  const font: FontPrefs = {}

  // `heading` was the old h1–h6 treatment. Only the family survived the
  // rework, as the serif stack; the rest is dropped rather than kept as dead
  // weight that every dirty check would still measure.
  const family = (value: unknown) => typeof value === 'string' && SAFE_FONT.test(value) ? value : undefined
  const sans = family(input.sans)
  if (sans && sans !== THEME_DEFAULTS.font) font.sans = sans
  const serif = family(input.serif) ?? family(input.heading?.font)
  if (serif) font.serif = serif
  const mono = family(input.mono)
  if (mono) font.mono = mono

  const weights: NonNullable<FontPrefs['weights']> = {}
  for (const step of ['normal', 'medium', 'semibold', 'bold'] as const) {
    const weight = clamped(input.weights?.[step], 100, 900)
    if (weight !== undefined) weights[step] = weight
  }
  if (Object.keys(weights).length) font.weights = weights

  if (input.uppercase) font.uppercase = true
  if (input.italic) font.italic = true
  const letterSpacing = clamped(input.letterSpacing, -0.2, 1)
  if (letterSpacing !== undefined && letterSpacing !== 0) font.letterSpacing = letterSpacing
  const lineHeight = clamped(input.lineHeight, 0.8, 3)
  if (lineHeight !== undefined && lineHeight !== 1.5) font.lineHeight = lineHeight

  return Object.keys(font).length ? font : undefined
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
    if (!parsed || typeof parsed !== 'object') return {}
    // Interim shape from this key's first iteration, where the family was
    // still a bare string beside a `fontPrefs` object. Never shipped, so this
    // only has to survive a branch checkout, not a release.
    if (typeof parsed.font === 'string' || parsed.fontPrefs) {
      parsed.font = { ...parsed.fontPrefs, ...(typeof parsed.font === 'string' ? { sans: parsed.font } : {}) }
      Reflect.deleteProperty(parsed, 'fontPrefs')
    }
    parsed.font = normalizeFont(parsed.font)
    return parsed as StoredTheme
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
