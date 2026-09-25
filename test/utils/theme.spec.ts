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

  it('blanks a top-level base', () => {
    // Single-element components (e.g. Skeleton) have no `slots`, their theme
    // is a top-level `base` string or array.
    const stringBase = { base: 'animate-pulse rounded-md bg-elevated' }
    expect(applyUnstyled(stringBase, true)).toEqual({ base: '' })
    expect(stringBase.base).toBe('animate-pulse rounded-md bg-elevated')

    expect(applyUnstyled({ base: ['flex', 'transition-colors'] }, true)).toEqual({ base: '' })
  })

  it('does not mutate the input theme', () => {
    // Object-shaped themes are shared module exports: blanking in place would
    // blank every later read within the same process.
    const input = theme()
    const snapshot = JSON.parse(JSON.stringify(input))

    const result = applyUnstyled(input, true)

    expect(result).not.toBe(input)
    expect(input).toEqual(snapshot)
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
