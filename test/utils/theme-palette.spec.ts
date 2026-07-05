import { describe, it, expect } from 'vitest'
import colors from 'tailwindcss/colors'
import {
  hexToOklch,
  oklchToHex,
  parseColor,
  inGamut,
  clampToGamut,
  contrastRatio,
  parseCssColor,
  generatePalette,
  fitCurve,
  fitPalette,
  sampleCurve,
  CURVE_DEFAULTS,
  NEUTRAL_CURVE_DEFAULTS,
  SHADES
} from '../../docs/app/utils/theme-engine'
import type { Shade } from '../../docs/app/utils/theme-engine'

function tailwindShades(name: keyof typeof colors): Record<Shade, string> {
  return Object.fromEntries(SHADES.map(shade => [shade, parseCssColor((colors[name] as Record<string, string>)[shade]!)!])) as Record<Shade, string>
}

describe('oklch', () => {
  it('matches reference values', () => {
    // Reference values from the CSS Color 4 / OKLab reference implementation
    const red = hexToOklch('#ff0000')
    expect(red.l).toBeCloseTo(0.6279, 3)
    expect(red.c).toBeCloseTo(0.2577, 3)
    expect(red.h).toBeCloseTo(29.23, 1)

    const white = hexToOklch('#ffffff')
    expect(white.l).toBeCloseTo(1, 3)
    expect(white.c).toBeCloseTo(0, 3)

    const black = hexToOklch('#000000')
    expect(black.l).toBeCloseTo(0, 3)
  })

  it('round-trips hex colors', () => {
    for (const hex of ['#1DB954', '#CC785C', '#3B82F6', '#FAF9F5', '#121212']) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex.toUpperCase())
    }
  })

  it('supports short hex notation', () => {
    expect(oklchToHex(hexToOklch('#f00'))).toBe('#FF0000')
  })

  it('clamps out-of-gamut colors by reducing chroma only', () => {
    const impossible = { l: 0.5, c: 0.4, h: 145 }
    expect(inGamut(impossible)).toBe(false)

    const clamped = clampToGamut(impossible)
    expect(inGamut(clamped)).toBe(true)
    expect(clamped.l).toBe(impossible.l)
    expect(clamped.h).toBe(impossible.h)
    expect(clamped.c).toBeLessThan(impossible.c)
  })

  it('computes WCAG contrast ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 2)
    // symmetric
    expect(contrastRatio('#1DB954', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#1DB954'), 5)
  })
})

describe('sampleCurve', () => {
  it('hits the endpoints exactly', () => {
    const curve = CURVE_DEFAULTS.lightness
    expect(sampleCurve(0, curve)).toBeCloseTo(curve.y0, 5)
    expect(sampleCurve(1, curve)).toBeCloseTo(curve.y1, 5)
  })

  it('interpolates a straight line when handles sit on it', () => {
    const curve = { y0: 0, y1: 1, p1x: 0.33, p1y: 0.33, p2x: 0.66, p2y: 0.66 }
    expect(sampleCurve(0.5, curve)).toBeCloseTo(0.5, 3)
  })
})

describe('fitCurve', () => {
  it('recovers a bezier from its own samples', () => {
    const original = { y0: 1, y1: 0, p1x: 0.2, p1y: 0.9, p2x: 0.8, p2y: 0.2 }
    const points = Array.from({ length: 11 }, (_, i) => {
      const x = i / 10
      return [x, sampleCurve(x, original)] as [number, number]
    })

    const fitted = fitCurve(points)
    for (const [x, y] of points) {
      expect(sampleCurve(x, fitted)).toBeCloseTo(y, 2)
    }
  })
})

describe('generatePalette', () => {
  it('produces 11 canonical oklch shades', () => {
    const palette = generatePalette(CURVE_DEFAULTS)

    expect(Object.keys(palette)).toHaveLength(SHADES.length)
    for (const shade of SHADES) {
      expect(palette[shade]).toMatch(/^oklch\(\d{1,3}(\.\d+)?% \d(\.\d+)? \d{1,3}(\.\d+)?\)$/)
    }
  })

  it('keeps default ramps monotonically darkening', () => {
    for (const hue of [30, 145, 250]) {
      const flat = { ...CURVE_DEFAULTS.hue, y0: hue, y1: hue, p1y: hue, p2y: hue }
      const palette = generatePalette({ ...CURVE_DEFAULTS, hue: flat })
      const lightnesses = SHADES.map(shade => parseColor(palette[shade])!.l)

      for (let i = 1; i < lightnesses.length; i++) {
        expect(lightnesses[i]!, `hue ${hue} shade ${SHADES[i]}`).toBeLessThan(lightnesses[i - 1]!)
      }
    }
  })

  it('neutral defaults reach a deep dark end', () => {
    const palette = generatePalette(NEUTRAL_CURVE_DEFAULTS)
    expect(parseColor(palette[950])!.l).toBeLessThan(0.16)
  })
})

describe('fitPalette (work backwards from real palettes)', () => {
  it.each(['blue', 'green', 'orange', 'rose', 'zinc'] as const)('round-trips tailwind %s', (name) => {
    const original = tailwindShades(name)
    const regenerated = generatePalette(fitPalette(original))

    for (const shade of SHADES) {
      const want = parseColor(original[shade])!
      const got = parseColor(regenerated[shade])!

      // A single cubic can't hit every tailwind stop exactly — ~0.045 L is
      // the model floor (worst case rose-900), well under a visible step.
      expect(Math.abs(got.l - want.l), `${name}-${shade} lightness`).toBeLessThan(0.045)
      expect(Math.abs(got.c - want.c), `${name}-${shade} chroma`).toBeLessThan(0.045)
    }
  })

  it('handles the hue wheel seam', () => {
    // rose/red hues sit near 0/360 — fitting must not zigzag across the seam
    const params = fitPalette(tailwindShades('rose'))
    const sampled = SHADES.map((_, i) => sampleCurve(i / 10, params.hue))

    for (let i = 1; i < sampled.length; i++) {
      expect(Math.abs(sampled[i]! - sampled[i - 1]!), `step ${i}`).toBeLessThan(90)
    }
  })

  it('keeps hue stable across near-gray stops', () => {
    const params = fitPalette(tailwindShades('zinc'))
    const hues = SHADES.map((_, i) => sampleCurve(i / 10, params.hue))
    const spread = Math.max(...hues) - Math.min(...hues)

    expect(spread).toBeLessThan(120)
  })
})
