import { isDefaultStyle } from './styles'

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type Shade = typeof SHADES[number]

export type ColorAlias = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export interface ThemePalette {
  /** Tailwind palette this one is based on, when only some shades differ */
  extends?: string
  shades: Partial<Record<Shade, string>>
  /**
   * Generator params the shades were materialized from (see palette.ts),
   * kept so the palette stays editable in the studio. Purely metadata:
   * exports and application always use the materialized `shades`.
   */
  curve?: import('./palette').PaletteCurveParams
}

/**
 * A theme is a sparse document: it stores only explicit overrides and
 * everything absent stays inherited from the Nuxt UI defaults. Serializing
 * the document therefore *is* the minimal export.
 */
export interface ThemeDoc {
  version: 1
  meta?: {
    name?: string
    /** Preset id this document was forked from */
    base?: string
    /** Seed used by shuffle, kept for reproducible rolls */
    seed?: number
  }
  /** L0 — custom palettes, injected as `--color-{name}-{shade}` */
  palettes?: Record<string, ThemePalette>
  /** L1 — alias → palette name (tailwind or a key of `palettes`) */
  colors?: Partial<Record<ColorAlias, string>>
  blackAsPrimary?: boolean
  /** L2 — semantic `--ui-*` token overrides per mode */
  tokens?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  radius?: number
  /** Root font size in px (`html { font-size }`) — scales every rem-based metric */
  fontSize?: number
  /** Tailwind v4 `--spacing` base unit in rem — the density knob behind all spacing utilities */
  spacing?: number
  font?: {
    sans?: string
    /**
     * Overrides for tailwind's weight steps — the knobs components
     * actually dereference (`font-medium` compiles to
     * `font-weight: var(--font-weight-medium)`). Sparse: only set steps
     * are emitted. normal also drives classless body text.
     */
    weights?: { normal?: number, medium?: number, semibold?: number, bold?: number }
    uppercase?: boolean
    italic?: boolean
    /** Tracking in em. */
    letterSpacing?: number
    /** Unitless line height (browser/tailwind default is 1.5). */
    lineHeight?: number
    /** Heading treatment (h1–h6); every field falls back to the base. */
    heading?: {
      font?: string
      weight?: number
      uppercase?: boolean
      italic?: boolean
      underline?: boolean
      letterSpacing?: number
      lineHeight?: number
    }
  }
  icons?: string
  /**
   * Shadow/border treatment, expanded into per-component overrides on apply
   * and export (no semantic shadow/border-width tokens in core yet).
   */
  style?: import('./styles').StyleOptions
  /** L4 — per-component overrides merged into `app.config ui.<component>` */
  components?: Record<string, Record<string, unknown>>
}

export const DEFAULT_COLORS: Record<ColorAlias, string> = {
  primary: 'green',
  secondary: 'blue',
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  error: 'red',
  neutral: 'slate'
}

export const THEME_DEFAULTS = {
  radius: 0.25,
  fontSize: 16,
  spacing: 0.25,
  font: 'Public Sans',
  icons: 'lucide'
} as const

export function createThemeDoc(): ThemeDoc {
  return { version: 1 }
}

/** A document with no overrides means "stock Nuxt UI". */
export function isDefaultTheme(doc: ThemeDoc): boolean {
  return !doc.palettes && !doc.colors && !doc.blackAsPrimary && !doc.tokens
    && doc.radius === undefined && doc.fontSize === undefined && doc.spacing === undefined
    && !doc.font?.sans && !doc.font?.weights && !doc.font?.heading
    && !doc.font?.uppercase && !doc.font?.italic
    && doc.font?.letterSpacing === undefined && doc.font?.lineHeight === undefined
    && !doc.icons && !doc.components
    && isDefaultStyle(doc.style)
}
