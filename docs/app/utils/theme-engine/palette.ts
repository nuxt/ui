import type { Shade } from './types'
import { SHADES, SHADES_FINE } from './types'
import { clampToGamut, formatOklch, parseColor } from './oklch'
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

/**
 * The editor's modifier lens: independent effects layered on top of base
 * curves — lightness shift, contrast about the ramp's own midpoint,
 * saturation (multiplicative with an additive floor, so gray ramps respond
 * too) and hue rotation, all scaled by an overall amount. Pure: always
 * derives fresh curves from the base, never compounding.
 */
export interface PaletteEffects {
  lightness: number
  contrast: number
  saturation: number
  hueShift: number
}

export const PALETTE_EFFECT_DEFAULTS: PaletteEffects = { lightness: 0, contrast: 0, saturation: 0, hueShift: 0 }

/**
 * A stop locked to an exact OKLCH the curves must pass through — "pin this
 * brand colour, edit around it". Stored as the absolute target; the ramp is
 * bent to hit it (see `pinField`), so it survives curve drags and modifiers.
 */
export interface PalettePin {
  shade: Shade
  l: number
  c: number
  h: number
}

/** A persisted palette: the base curves plus the modifier lens over them. */
export type StoredPaletteParams = PaletteCurveParams & { effects?: PaletteEffects, amount?: number, fineStops?: boolean, pins?: PalettePin[] }

// Width (in ramp x, 0–1) of each pin's influence. A pinned stop is hit
// exactly; neighbours bend smoothly toward it and the effect decays to ~0 by
// ~2σ away, so distant stops keep following the base curve. Narrow enough to
// feel local, wide enough that the ramp stays smooth (no kink at the pin).
const PIN_KERNEL_SIGMA = 0.2

function pinKernel(distance: number): number {
  const t = distance / PIN_KERNEL_SIGMA
  return Math.exp(-t * t)
}

/**
 * Solve `A·x = b` for a small dense symmetric system (Gauss–Jordan with
 * partial pivoting). Pins are ≤19, so this is trivially fast; a near-singular
 * pivot (coincident stops) collapses that weight to 0 rather than exploding.
 */
function solveLinear(a: number[][], b: number[]): number[] {
  const n = b.length
  const m = a.map((row, i) => [...row, b[i]!])
  for (let col = 0; col < n; col++) {
    let pivot = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(m[row]![col]!) > Math.abs(m[pivot]![col]!)) pivot = row
    }
    ;[m[col], m[pivot]] = [m[pivot]!, m[col]!]
    const diag = m[col]![col]!
    if (Math.abs(diag) < 1e-12) continue
    for (let row = 0; row < n; row++) {
      if (row === col) continue
      const factor = m[row]![col]! / diag
      for (let k = col; k <= n; k++) m[row]![k]! -= factor * m[col]![k]!
    }
  }
  return m.map((row, i) => (Math.abs(row[i]!) < 1e-12 ? 0 : row[n]! / row[i]!))
}

/**
 * Build the additive correction field that locks the pins. Each channel's
 * correction is a radial-basis interpolation of the pin deltas (target minus
 * the base curve at the pin), so at a pinned x it equals the delta exactly —
 * `base + correction` renders the target — and decays smoothly elsewhere.
 * Hue deltas take the short way round the circle.
 */
function pinField(pins: PalettePin[], base: (x: number) => { l: number, c: number, h: number }) {
  const xs = pins.map(pin => shadeX(pin.shade))
  const matrix = xs.map(xi => xs.map(xj => pinKernel(Math.abs(xi - xj))))
  const deltaL: number[] = []
  const deltaC: number[] = []
  const deltaH: number[] = []
  pins.forEach((pin, i) => {
    const b = base(xs[i]!)
    deltaL.push(pin.l - b.l)
    deltaC.push(pin.c - b.c)
    deltaH.push(((((pin.h - b.h) % 360) + 540) % 360) - 180)
  })
  const wl = solveLinear(matrix, deltaL)
  const wc = solveLinear(matrix, deltaC)
  const wh = solveLinear(matrix, deltaH)
  return (x: number) => {
    let dl = 0
    let dc = 0
    let dh = 0
    for (let j = 0; j < xs.length; j++) {
      const k = pinKernel(Math.abs(x - xs[j]!))
      dl += wl[j]! * k
      dc += wc[j]! * k
      dh += wh[j]! * k
    }
    return { dl, dc, dh }
  }
}

export function isDefaultEffects(effects?: PaletteEffects, amount = 100): boolean {
  if (amount !== 100) return false
  if (!effects) return true
  return (Object.keys(PALETTE_EFFECT_DEFAULTS) as Array<keyof PaletteEffects>)
    .every(key => effects[key] === PALETTE_EFFECT_DEFAULTS[key])
}

export function applyPaletteEffects(base: PaletteCurveParams, effects?: PaletteEffects, amount = 100): PaletteCurveParams {
  const target = structuredClone(base)
  if (isDefaultEffects(effects, amount)) return target

  // The strength scales every effect's distance from its default: 100% as
  // set, lower blends back toward the base, higher extrapolates past.
  const strength = amount / 100
  const effective = (key: keyof PaletteEffects) =>
    PALETTE_EFFECT_DEFAULTS[key] + ((effects?.[key] ?? PALETTE_EFFECT_DEFAULTS[key]) - PALETTE_EFFECT_DEFAULTS[key]) * strength

  // Lightness: contrast expands/compresses about the curve's own midpoint,
  // then the shift slides the whole ramp. Every point clamps to the
  // physical [0, 1] window, exactly like a drag stopping at the edge.
  const lightness = target.lightness
  const mid = (lightness.y0 + lightness.y1) / 2
  const span = 1 + effective('contrast') / 100
  const shift = effective('lightness') / 100
  const mapLightness = (value: number) => Math.min(1, Math.max(0, mid + (value - mid) * span + shift))
  lightness.y0 = mapLightness(lightness.y0)
  lightness.y1 = mapLightness(lightness.y1)
  lightness.p1y = mapLightness(lightness.p1y)
  lightness.p2y = mapLightness(lightness.p2y)

  // Saturation: scale for colorful ramps, plus a small additive floor when
  // boosting so near-gray ramps (where a multiply is a no-op) respond too.
  // Clamped to the editor's chroma window (sRGB tops out around 0.37).
  const saturation = effective('saturation') / 100
  const factor = 1 + saturation
  const floor = Math.max(0, saturation) * 0.02
  const mapChroma = (value: number) => Math.min(0.4, Math.max(0, value * factor + floor))
  const chroma = target.chroma
  chroma.y0 = mapChroma(chroma.y0)
  chroma.y1 = mapChroma(chroma.y1)
  chroma.p1y = mapChroma(chroma.p1y)
  chroma.p2y = mapChroma(chroma.p2y)

  // Hue shifts the whole curve, then re-centers by full turns so the mean
  // stays in [0, 360) — a uniform shift keeps the curve continuous, and
  // hue is cyclic so the colors are identical.
  const hueShift = effective('hueShift')
  const hue = target.hue
  hue.y0 += hueShift
  hue.y1 += hueShift
  hue.p1y += hueShift
  hue.p2y += hueShift
  const mean = (hue.y0 + hue.y1 + hue.p1y + hue.p2y) / 4
  const turns = -360 * Math.floor(mean / 360)
  if (turns !== 0) {
    hue.y0 += turns
    hue.y1 += turns
    hue.p1y += turns
    hue.p2y += turns
  }

  return target
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

/**
 * A shade's fixed position along the curve (x: 0 = shade 50 … 1 = shade 950),
 * keyed by VALUE not array index — so the standard 11 stops keep their exact
 * position (and colour) whether or not the fine midpoints are generated, and
 * a midpoint like 150 lands halfway between 100 (0.1) and 200 (0.2).
 */
export function shadeX(shade: Shade): number {
  if (shade === 50) return 0
  if (shade === 950) return 1
  return shade / 1000
}

/**
 * A reusable sampler for the pin-corrected ramp: solves the pin field once,
 * then returns the raw channel values at any x — hue unwrapped, no gamut clamp
 * — so a curve drawn through them stays continuous and bends through pinned
 * stops (which `generatePalette` then clamps per stop for the actual colours).
 */
export function buildRampSampler(params: PaletteCurveParams, pins: PalettePin[] = []): (x: number) => { l: number, c: number, h: number } {
  const base = (x: number) => ({
    l: sampleCurve(x, params.lightness),
    c: sampleCurve(x, params.chroma),
    h: sampleCurve(x, params.hue)
  })
  const correct = pins.length ? pinField(pins, base) : undefined
  return (x: number) => {
    const b = base(x)
    if (!correct) return b
    const d = correct(x)
    return { l: b.l + d.dl, c: b.c + d.dc, h: b.h + d.dh }
  }
}

export function generatePalette(params: PaletteCurveParams, fine = false, pins: PalettePin[] = []): Record<Shade, string> {
  const result = {} as Record<Shade, string>

  const base = (x: number) => ({
    l: sampleCurve(x, params.lightness),
    c: sampleCurve(x, params.chroma),
    h: sampleCurve(x, params.hue)
  })
  // The pin correction is added to the raw curve sample (pre-clamp), so a
  // pinned stop lands on its target exactly whenever that target is in gamut.
  const correct = pins.length ? pinField(pins, base) : undefined

  for (const shade of fine ? SHADES_FINE : SHADES) {
    const x = shadeX(shade)
    const b = base(x)
    const d = correct ? correct(x) : { dl: 0, dc: 0, dh: 0 }

    // Clamp here, not in the serializer: sculpted curves can demand
    // impossible chroma, and the swatches/contrast math assume sRGB.
    // Lightness clamps too — clampToGamut only searches chroma, so an
    // overshooting curve (handles may exceed the window) would otherwise
    // emit oklch(112% …) verbatim into exports and contrast math. Hue
    // wraps into [0, 360): a negative or 4-digit hue would fail the
    // sanitizer's canonical-oklch check and silently DROP the shade.
    result[shade] = formatOklch(clampToGamut({
      l: Math.min(1, Math.max(0, b.l + d.dl)),
      c: Math.max(0, b.c + d.dc),
      h: ((((b.h + d.dh) % 360) + 360) % 360)
    }))
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
  // Nothing to fit — a flat zero curve beats a TypeError.
  if (!points.length) {
    return { y0: 0, p1x: 0.33, p1y: 0, p2x: 0.66, p2y: 0, y1: 0 }
  }
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
    // Accept hex or oklch — older saved docs and pasted ramps are hex.
    const color = shades[shade] ? parseColor(shades[shade]!) : undefined
    if (color) {
      stops.push({ x: index / (SHADES.length - 1), color })
    }
  }

  // Nothing parseable to fit — fall back to the stock curves rather than
  // letting fitCurve([]) throw.
  if (!stops.length) {
    return structuredClone(CURVE_DEFAULTS)
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
