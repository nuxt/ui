import type { Shade } from './types'
import { SHADES } from './types'
import { hexToOklch, oklchToHex } from './oklch'
import type { Oklch } from './oklch'

/**
 * A palette is three transition curves — lightness, chroma and hue — sampled
 * across the 11 shade stops (x: 0 = shade 50 … 1 = shade 950). Each channel
 * is a cubic bezier in the devtools-easing sense: endpoints pinned to the
 * left/right edges with adjustable y, plus two free control handles.
 * All y values are in channel units (L 0–1, C 0–0.4, H degrees); handles may
 * overshoot the endpoints.
 */
export interface ChannelCurve {
  /** Channel value at shade 50 */
  y0: number
  /** Channel value at shade 950 */
  y1: number
  p1x: number
  p1y: number
  p2x: number
  p2y: number
}

export interface PaletteCurveParams {
  lightness: ChannelCurve
  chroma: ChannelCurve
  hue: ChannelCurve
}

/**
 * Fallback curves fitted to tailwind v4's color ramps. In practice params
 * come from `fitPalette()` over a real palette, so these only seed empty
 * states.
 */
export const CURVE_DEFAULTS: PaletteCurveParams = {
  lightness: { y0: 0.977, y1: 0.27, p1x: 0.1, p1y: 1.012, p2x: 0.925, p2y: 0.376 },
  chroma: { y0: 0.016, y1: 0.08, p1x: 0.4, p1y: 0.3, p2x: 0.6, p2y: 0.25 },
  hue: { y0: 250, y1: 250, p1x: 0.33, p1y: 250, p2x: 0.66, p2y: 250 }
}

/**
 * Neutral ramps want a much deeper dark end than color ramps: tailwind's
 * grays run to L 0.13 so dark-mode backgrounds stay genuinely dark.
 */
export const NEUTRAL_CURVE_DEFAULTS: PaletteCurveParams = {
  lightness: { ...CURVE_DEFAULTS.lightness, y1: 0.13 },
  chroma: { y0: 0.005, y1: 0.01, p1x: 0.4, p1y: 0.01, p2x: 0.6, p2y: 0.01 },
  hue: CURVE_DEFAULTS.hue
}

function cubicBezier(t: number, a: number, b: number, c: number, d: number): number {
  const u = 1 - t
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d
}

/**
 * Sample a channel curve at ramp position `x` (0–1). Control x values are
 * clamped into [0, 1], keeping x(t) monotonic so the solve is well-defined.
 */
export function sampleCurve(x: number, curve: ChannelCurve): number {
  const p1x = Math.min(1, Math.max(0, curve.p1x))
  const p2x = Math.min(1, Math.max(0, curve.p2x))

  let lo = 0
  let hi = 1
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2
    if (cubicBezier(mid, 0, p1x, p2x, 1) < x) {
      lo = mid
    } else {
      hi = mid
    }
  }
  const t = (lo + hi) / 2

  return cubicBezier(t, curve.y0, curve.p1y, curve.p2y, curve.y1)
}

export function generatePalette(params: PaletteCurveParams): Record<Shade, string> {
  const result = {} as Record<Shade, string>

  for (const [index, shade] of SHADES.entries()) {
    const x = index / (SHADES.length - 1)

    result[shade] = oklchToHex({
      l: sampleCurve(x, params.lightness),
      c: Math.max(0, sampleCurve(x, params.chroma)),
      h: sampleCurve(x, params.hue)
    })
  }

  return result
}

/**
 * Fit a channel curve to sampled points (x ascending, 0 and 1 included).
 * Endpoints are pinned to the first/last values; the two handles are found
 * by coordinate descent — small, deterministic and fast enough to run on
 * every palette selection.
 */
export function fitCurve(points: Array<[number, number]>): ChannelCurve {
  const y0 = points[0]![1]
  const y1 = points[points.length - 1]![1]
  const span = Math.max(Math.abs(y1 - y0), 1e-6)

  const lerp = (x: number) => y0 + (y1 - y0) * x

  const error = (curve: ChannelCurve) => {
    let sum = 0
    for (const [x, y] of points) {
      const d = sampleCurve(x, curve) - y
      sum += d * d
    }
    return sum
  }

  const keys = ['p1x', 'p1y', 'p2x', 'p2y'] as const

  // Coordinate descent with per-parameter line search, from a few handle
  // placements so a bad basin doesn't trap the fit.
  let winner: ChannelCurve | undefined
  let winnerError = Infinity

  for (const [p1x, p2x] of [[0.33, 0.66], [0.15, 0.85], [0.45, 0.55]] as const) {
    const curve: ChannelCurve = { y0, y1, p1x, p1y: lerp(p1x), p2x, p2y: lerp(p2x) }
    let best = error(curve)
    let stepX = 0.2
    let stepY = span * 0.4

    for (let round = 0; round < 200; round++) {
      let improved = false
      for (const key of keys) {
        const isX = key === 'p1x' || key === 'p2x'
        const step = isX ? stepX : stepY
        for (const direction of [1, -1]) {
          // Walk while it keeps improving.
          for (;;) {
            const previous = curve[key]
            const next = previous + direction * step
            curve[key] = isX ? Math.min(1, Math.max(0, next)) : next
            const err = error(curve)
            if (err < best - 1e-14) {
              best = err
              improved = true
            } else {
              curve[key] = previous
              break
            }
          }
        }
      }
      if (!improved) {
        stepX /= 2
        stepY /= 2
        if (stepX < 1e-4) break
      }
    }

    if (best < winnerError) {
      winnerError = best
      winner = curve
    }
  }

  return winner!
}

/**
 * Work backwards from an existing palette (e.g. a tailwind ramp) to curve
 * params that reproduce it — so editing always starts from the real thing.
 * Hue needs care: it is unwrapped around the color wheel and meaningless on
 * near-gray stops, where it borrows the nearest chromatic neighbor.
 */
export function fitPalette(shades: Partial<Record<Shade, string>>): PaletteCurveParams {
  const stops: Array<{ x: number, color: Oklch }> = []
  for (const [index, shade] of SHADES.entries()) {
    const hex = shades[shade]
    if (hex) {
      stops.push({ x: index / (SHADES.length - 1), color: hexToOklch(hex) })
    }
  }

  // Hue is noise below ~0.01 chroma — borrow the nearest chromatic stop.
  const chromatic = stops.filter(stop => stop.color.c >= 0.01)
  const hues = stops.map((stop) => {
    if (stop.color.c >= 0.01 || !chromatic.length) return stop.color.h
    const nearest = chromatic.reduce((a, b) => Math.abs(a.x - stop.x) < Math.abs(b.x - stop.x) ? a : b)
    return nearest.color.h
  })

  // Unwrap so the sequence is continuous even across the 0/360 seam.
  for (let i = 1; i < hues.length; i++) {
    while (hues[i]! - hues[i - 1]! > 180) hues[i]! -= 360
    while (hues[i]! - hues[i - 1]! < -180) hues[i]! += 360
  }

  return {
    lightness: fitCurve(stops.map(stop => [stop.x, stop.color.l])),
    chroma: fitCurve(stops.map(stop => [stop.x, stop.color.c])),
    hue: fitCurve(stops.map((stop, i) => [stop.x, hues[i]!]))
  }
}
