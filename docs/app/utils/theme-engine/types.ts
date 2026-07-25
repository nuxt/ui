import { isDefaultStyle } from './styles'

export const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * Every stop any density can emit: the 10-step ladder plus the odd 25-step
 * quarters (75, 125…). `Shade` is that whole union, so each density's set is a
 * subset of it and a stop stays a valid shade whichever density produced it.
 */
export const SHADES_ALL = [50, 60, 70, 75, 80, 90, 100, 110, 120, 125, 130, 140, 150, 160, 170, 175, 180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 270, 275, 280, 290, 300, 310, 320, 325, 330, 340, 350, 360, 370, 375, 380, 390, 400, 410, 420, 425, 430, 440, 450, 460, 470, 475, 480, 490, 500, 510, 520, 525, 530, 540, 550, 560, 570, 575, 580, 590, 600, 610, 620, 625, 630, 640, 650, 660, 670, 675, 680, 690, 700, 710, 720, 725, 730, 740, 750, 760, 770, 775, 780, 790, 800, 810, 820, 825, 830, 840, 850, 860, 870, 875, 880, 890, 900, 910, 920, 925, 930, 940, 950] as const

export type Shade = typeof SHADES_ALL[number]

/**
 * Stop density, as the gap between stops. A palette carries one in its
 * `stopStep`; generation and the shade sliders then span that set. Ordered
 * coarse → fine, which `detectStopStep` reads back in order.
 */
export const SHADE_STEPS = [100, 50, 25, 10] as const

export type ShadeStep = typeof SHADE_STEPS[number]

/** The stops each density emits: 11, 19, 37 and 91. */
export const SHADE_SETS: Record<ShadeStep, readonly Shade[]> = {
  // The standard ramp is the only irregular one — 50 and 950 are half-steps
  // at the ends. Every finer density is just the multiples of its step, which
  // already include both ends.
  100: SHADES,
  50: SHADES_ALL.filter(shade => shade % 50 === 0),
  25: SHADES_ALL.filter(shade => shade % 25 === 0),
  10: SHADES_ALL.filter(shade => shade % 10 === 0)
}

export type ShadeStop = 'white' | Shade | 'black'

/**
 * The shade sliders' full travel: a density's stops plus literal white/black
 * ends. The ends matter because several stock defaults are literals the ramp
 * can't express (--ui-bg is `white`, the stock dark shadow is `black`) —
 * without them the sliders could only pin lookalike ramp overrides.
 */
const ladder = (step: ShadeStep): readonly ShadeStop[] => ['white', ...SHADE_SETS[step], 'black']

export const SHADE_LADDERS: Record<ShadeStep, readonly ShadeStop[]> = {
  100: ladder(100),
  50: ladder(50),
  25: ladder(25),
  10: ladder(10)
}

/** The standard ladder — what stock ramps (and plain rows) travel. */
export const SHADE_LADDER = SHADE_LADDERS[100]

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
