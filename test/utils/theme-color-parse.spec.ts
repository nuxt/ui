import { describe, it, expect } from 'vitest'
import { parseCssColor } from '../../docs/app/utils/theme/engine'
import colors from 'tailwindcss/colors'

describe('parseCssColor', () => {
  it('normalizes hex to canonical oklch', () => {
    expect(parseCssColor('#cc785c')).toBe('oklch(65.8% 0.113 39.145)')
    expect(parseCssColor(' #F00 ')).toBe('oklch(62.8% 0.258 29.234)')
  })

  it('passes canonical oklch through losslessly, including out of sRGB', () => {
    // wide-gamut values must survive unclamped, tailwind ships several
    expect(parseCssColor('oklch(62.3% 0.214 259.815)')).toBe('oklch(62.3% 0.214 259.815)')
    expect(parseCssColor('oklch(70% 0.35 150)')).toBe('oklch(70% 0.35 150)')
  })

  it('is idempotent over the real tailwind palette', () => {
    // Idempotence, not equality with the vendor string: a tailwind bump that
    // changes formatting (4.3.3 started emitting `none`) must not red CI.
    for (const ramp of [colors.blue, colors.slate, colors.zinc]) {
      for (const value of Object.values(ramp)) {
        const once = parseCssColor(value)
        expect(once, value).toBeDefined()
        expect(parseCssColor(once!)).toBe(once)
      }
    }
  })

  it('normalizes fractional lightness to percentage', () => {
    expect(parseCssColor('oklch(100% 0 0)')).toBe('oklch(100% 0 0)')
    expect(parseCssColor('oklch(0 0 0)')).toBe('oklch(0% 0 0)')
  })

  it('parses rgb values', () => {
    expect(parseCssColor('rgb(255, 0, 0)')).toBe('oklch(62.8% 0.258 29.234)')
    expect(parseCssColor('rgb(29 185 84)')).toBe('oklch(68.9% 0.187 148.921)')
  })

  it('understands the white/black keywords the library tokens use', () => {
    expect(parseCssColor('white')).toBe('oklch(100% 0 0)')
    expect(parseCssColor('black')).toBe('oklch(0% 0 0)')
  })

  it('returns undefined for unknown formats', () => {
    expect(parseCssColor('hotpink')).toBeUndefined()
    expect(parseCssColor('var(--color-red-500)')).toBeUndefined()
  })
})
