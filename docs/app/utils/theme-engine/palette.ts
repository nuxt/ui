import type { Shade } from './types'
import { SHADES } from './types'
import { hexToOklch, oklchToHex } from './oklch'

/**
 * Parametric ramp generator: an anchor color pinned at shade 500 with three
 * curves fitted around it — lightness (monotonic, endpoints adjustable),
 * chroma (bell around the anchor) and hue (linear drift). A handful of
 * knobs instead of 33 free numbers; per-shade overrides can still be layered
 * on top via `ThemePalette.shades`.
 */
export interface PaletteCurveParams {
  /** Hex color pinned exactly at shade 500 */
  anchor: string
  /** Lightness of shade 50 (0–1). Lower it when the default -50s feel too white. */
  lightest?: number
  /** Lightness of shade 950 (0–1) */
  darkest?: number
  /** Chroma multiplier applied to the whole ramp */
  vibrance?: number
  /** Width of the chroma bell — higher keeps the ends more saturated */
  spread?: number
  /** Total hue rotation in degrees across the ramp (light end −½, dark end +½) */
  hueDrift?: number
}

export const CURVE_DEFAULTS = {
  lightest: 0.977,
  darkest: 0.27,
  vibrance: 1,
  spread: 0.5,
  hueDrift: 0
} as const

/**
 * Neutral ramps want a much deeper dark end than color ramps: tailwind's
 * color palettes stop near L 0.27 (a near-black blue is useless), while the
 * grays run to L 0.13 so dark-mode backgrounds stay genuinely dark.
 */
export const NEUTRAL_CURVE_DEFAULTS = {
  ...CURVE_DEFAULTS,
  darkest: 0.13
} as const

/**
 * Lightness targets per stop averaged from tailwind v4's color ramps
 * (blue/green/orange), used as the base curve shape and rescaled piecewise
 * so the anchor's own lightness lands exactly on shade 500.
 */
const BASE_LIGHTNESS: Record<Shade, number> = {
  50: 0.977,
  100: 0.949,
  200: 0.903,
  300: 0.838,
  400: 0.749,
  500: 0.684,
  600: 0.607,
  700: 0.523,
  800: 0.447,
  900: 0.393,
  950: 0.271
}

export function generatePalette(params: PaletteCurveParams): Record<Shade, string> {
  const { anchor } = params
  const anchorColor = hexToOklch(anchor)

  // Keep the curve monotonic even for very light/dark anchors — 0.04 of
  // lightness spread is roughly the minimum that survives 8-bit rounding
  // without adjacent stops collapsing into the same hex.
  const lightest = Math.max(params.lightest ?? CURVE_DEFAULTS.lightest, Math.min(anchorColor.l + 0.04, 0.995))
  const darkest = Math.min(params.darkest ?? CURVE_DEFAULTS.darkest, Math.max(anchorColor.l - 0.04, 0.005))
  const vibrance = params.vibrance ?? CURVE_DEFAULTS.vibrance
  const spread = params.spread ?? CURVE_DEFAULTS.spread
  const hueDrift = params.hueDrift ?? CURVE_DEFAULTS.hueDrift

  const result = {} as Record<Shade, string>

  for (const [index, shade] of SHADES.entries()) {
    if (shade === 500) {
      result[shade] = anchor.toUpperCase()
      continue
    }

    // Rescale the base lightness curve piecewise around the anchor so its
    // shape is preserved on both sides of shade 500.
    const base = BASE_LIGHTNESS[shade]
    const anchorBase = BASE_LIGHTNESS[500]
    let l: number
    if (shade < 500) {
      const t = (base - anchorBase) / (BASE_LIGHTNESS[50] - anchorBase)
      l = anchorColor.l + t * (lightest - anchorColor.l)
    } else {
      const t = (anchorBase - base) / (anchorBase - BASE_LIGHTNESS[950])
      l = anchorColor.l + t * (darkest - anchorColor.l)
    }

    // Chroma bell centered on the anchor stop, normalized to 1 there.
    const t = index / (SHADES.length - 1)
    const bell = Math.exp(-((t - 0.5) ** 2) / (2 * spread ** 2))
    const c = anchorColor.c * vibrance * bell

    const h = anchorColor.h + hueDrift * (t - 0.5)

    result[shade] = oklchToHex({ l, c, h })
  }

  return result
}
