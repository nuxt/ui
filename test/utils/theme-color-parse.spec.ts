import { describe, it, expect } from 'vitest'
import { parseCssColor } from '../../theme-studio/app/utils/theme-engine'
import colors from 'tailwindcss/colors'

describe('parseCssColor', () => {
  it('normalizes hex to canonical oklch', () => {
    expect(parseCssColor('#cc785c')).toBe('oklch(65.8% 0.113 39.145)')
    expect(parseCssColor(' #F00 ')).toBe('oklch(62.8% 0.258 29.234)')
  })

  it('passes tailwind v4 oklch values through losslessly', () => {
    // Tailwind's palette strings already use the canonical shape — the
    // round trip must not clamp or reformat them (some exceed sRGB).
    expect(parseCssColor(colors.blue[500])).toBe(colors.blue[500])
    expect(parseCssColor(colors.slate[50])).toBe(colors.slate[50])
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
