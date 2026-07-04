import { describe, it, expect } from 'vitest'
import { parseCssColor } from '../../docs/app/utils/theme-engine'
import colors from 'tailwindcss/colors'

describe('parseCssColor', () => {
  it('passes hex through normalized', () => {
    expect(parseCssColor('#cc785c')).toBe('#CC785C')
    expect(parseCssColor(' #F00 ')).toBe('#FF0000')
  })

  it('parses tailwind v4 oklch values', () => {
    // Every tailwind palette value must survive the round trip.
    const hex = parseCssColor(colors.blue[500])
    expect(hex).toMatch(/^#[0-9A-F]{6}$/)
  })

  it('parses oklch with percentage lightness', () => {
    expect(parseCssColor('oklch(100% 0 0)')).toBe('#FFFFFF')
    expect(parseCssColor('oklch(0 0 0)')).toBe('#000000')
  })

  it('parses rgb values', () => {
    expect(parseCssColor('rgb(255, 0, 0)')).toBe('#FF0000')
    expect(parseCssColor('rgb(29 185 84)')).toBe('#1DB954')
  })

  it('returns undefined for unknown formats', () => {
    expect(parseCssColor('hotpink')).toBeUndefined()
    expect(parseCssColor('var(--color-red-500)')).toBeUndefined()
  })
})
