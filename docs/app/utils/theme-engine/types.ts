import { isDefaultStyle } from './styles'

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * The optional "fine" ramp: the standard stops plus the 100-step midpoints
 * (150…850). A palette opts in via its `fineStops` flag; generation and the
 * shade sliders then span these 19 stops. `Shade` is the union of the fine
 * set, so every fine stop is a valid shade — the standard 11 are a subset,
 * and a non-fine palette simply never emits the extras.
 */
export const SHADES_FINE = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950] as const

export type Shade = typeof SHADES_FINE[number]

/**
 * The shade sliders' full travel: the ramp plus literal white/black ends.
 * The ends matter because several stock defaults are literals the ramp
 * can't express (--ui-bg is `white`, the stock dark shadow is `black`) —
 * without them the sliders could only pin lookalike ramp overrides.
 * `SHADE_LADDER_FINE` is the same with the midpoints, for fine-stops ramps.
 */
export const SHADE_LADDER = ['white', ...SHADES, 'black'] as const
export const SHADE_LADDER_FINE = ['white', ...SHADES_FINE, 'black'] as const

export type ShadeStop = typeof SHADE_LADDER_FINE[number]

export type ColorAlias = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export interface ThemePalette {
  shades: Partial<Record<Shade, string>>
}

/**
 * A theme is a sparse document: it stores only explicit overrides and
 * everything absent stays inherited from the Nuxt UI defaults. Serializing
 * the document therefore *is* the minimal export.
 */
export interface ThemeDoc {
  version: 1
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

/** Every color alias that isn't primary or neutral. */
export const SEMANTIC_ALIASES = ['secondary', 'success', 'info', 'warning', 'error'] as const

export const THEME_DEFAULTS = {
  radius: 0.25,
  fontSize: 16,
  spacing: 0.25,
  font: 'Public Sans',
  icons: 'lucide'
} as const

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
