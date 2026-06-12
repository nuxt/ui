import { describe, it, expect } from 'vitest'
import { applyUnstyled } from '../../src/utils/theme'

describe('applyUnstyled', () => {
  const theme = () => ({
    slots: {
      base: 'inline-flex rounded-md',
      label: 'truncate'
    },
    variants: {
      color: {
        primary: 'bg-primary text-inverted',
        neutral: { base: 'bg-inverted', label: 'text-default' }
      },
      size: {
        md: { base: 'px-2.5 text-sm' }
      }
    },
    compoundVariants: [
      { color: 'primary', variant: 'solid', class: 'bg-primary' },
      { size: 'md', class: { base: 'gap-1.5' } }
    ],
    defaultVariants: {
      color: 'primary',
      size: 'md'
    }
  })

  it('returns the theme untouched when unstyled is falsy', () => {
    const input = theme()
    expect(applyUnstyled(input, false)).toBe(input)
    expect(applyUnstyled(input, undefined)).toBe(input)
    expect(input).toEqual(theme())
  })

  it('blanks every slot class but keeps the slot keys', () => {
    const result = applyUnstyled(theme(), true)
    expect(result.slots).toEqual({ base: '', label: '' })
  })

  it('blanks variant classes in both string and slot-object forms', () => {
    const result = applyUnstyled(theme(), true)
    expect(result.variants.color.primary).toBe('')
    expect(result.variants.color.neutral).toEqual({ base: '', label: '' })
    expect(result.variants.size.md).toEqual({ base: '' })
  })

  it('blanks compoundVariants classes but keeps the selectors', () => {
    const result = applyUnstyled(theme(), true)
    expect(result.compoundVariants).toEqual([
      { color: 'primary', variant: 'solid', class: '' },
      { size: 'md', class: { base: '' } }
    ])
  })

  it('preserves defaultVariants and variant keys so props still validate', () => {
    const result = applyUnstyled(theme(), true)
    expect(result.defaultVariants).toEqual({ color: 'primary', size: 'md' })
    expect(Object.keys(result.variants)).toEqual(['color', 'size'])
    expect(Object.keys(result.variants.color)).toEqual(['primary', 'neutral'])
  })
})
