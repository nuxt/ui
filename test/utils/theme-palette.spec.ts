import { describe, it, expect } from 'vitest'
import {
  hexToOklch,
  oklchToHex,
  inGamut,
  clampToGamut,
  contrastRatio,
  generatePalette,
  SHADES
} from '../../docs/app/utils/theme-engine'

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

describe('generatePalette', () => {
  it('produces 11 valid hex shades with the anchor exact at 500', () => {
    const palette = generatePalette({ anchor: '#1DB954' })

    expect(Object.keys(palette)).toHaveLength(SHADES.length)
    expect(palette[500]).toBe('#1DB954')
    for (const shade of SHADES) {
      expect(palette[shade]).toMatch(/^#[0-9A-F]{6}$/)
    }
  })

  it('keeps lightness monotonically decreasing from 50 to 950', () => {
    for (const anchor of ['#1DB954', '#CC785C', '#3B82F6', '#8E8672']) {
      const palette = generatePalette({ anchor })
      const lightnesses = SHADES.map(shade => hexToOklch(palette[shade]).l)

      for (let i = 1; i < lightnesses.length; i++) {
        expect(lightnesses[i]!, `${anchor} shade ${SHADES[i]}`).toBeLessThan(lightnesses[i - 1]!)
      }
    }
  })

  it('honors the lightest/darkest endpoints', () => {
    const palette = generatePalette({ anchor: '#8E8672', lightest: 0.94, darkest: 0.2 })

    expect(hexToOklch(palette[50]).l).toBeCloseTo(0.94, 2)
    expect(hexToOklch(palette[950]).l).toBeCloseTo(0.2, 2)
  })

  it('scales chroma with vibrance', () => {
    const muted = generatePalette({ anchor: '#3B82F6', vibrance: 0.5 })
    const vivid = generatePalette({ anchor: '#3B82F6', vibrance: 1.5 })

    // Compare a dark shade — very light shades gamut-clamp to the same ceiling.
    expect(hexToOklch(muted[700]).c).toBeLessThan(hexToOklch(vivid[700]).c)
  })

  it('drifts hue across the ramp', () => {
    const palette = generatePalette({ anchor: '#3B82F6', hueDrift: 40, vibrance: 1 })

    const light = hexToOklch(palette[100]).h
    const dark = hexToOklch(palette[900]).h
    expect(dark).toBeGreaterThan(light)
  })

  it('stays ordered for near-extreme anchors', () => {
    // At true extremes the ramp degenerates by design; 8-bit rounding may
    // produce equal neighbors, but the order must never invert.
    for (const anchor of ['#F5F5F0', '#16130F']) {
      const palette = generatePalette({ anchor })
      const lightnesses = SHADES.map(shade => hexToOklch(palette[shade]).l)

      for (let i = 1; i < lightnesses.length; i++) {
        expect(lightnesses[i]!, `${anchor} shade ${SHADES[i]}`).toBeLessThanOrEqual(lightnesses[i - 1]!)
      }
    }
  })
})
