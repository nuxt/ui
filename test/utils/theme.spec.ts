import { describe, it, expect } from 'vitest'
import { applyDefaultVariants, applyUnstyled, expandColorVariants } from '../../src/utils/theme'

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

  it('blanks a single-slot theme', () => {
    // Single-element components (e.g. Skeleton) declare one `base` slot.
    const theme = { slots: { base: 'animate-pulse rounded-md bg-elevated' } }
    expect(applyUnstyled(theme, true)).toEqual({ slots: { base: '' } })
    expect(theme.slots.base).toBe('animate-pulse rounded-md bg-elevated')

    expect(applyUnstyled({ slots: { base: ['flex', 'transition-colors'] } }, true)).toEqual({ slots: { base: '' } })
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

describe('applyDefaultVariants', () => {
  it('does not mutate a shared theme object', () => {
    const theme = { slots: { base: '' }, defaultVariants: { color: 'primary', size: 'md' } }
    const result = applyDefaultVariants(theme, { color: 'neutral', size: 'sm' })
    expect(result.defaultVariants).toEqual({ color: 'neutral', size: 'sm' })
    expect(theme.defaultVariants).toEqual({ color: 'primary', size: 'md' })
  })
})

describe('expandColorVariants', () => {
  const theme = () => ({
    slots: { base: 'inline-flex' },
    variants: {
      color: {
        '*': { base: '[--ui-accent:var(--ui-{value})]' },
        'secondary': { base: 'own-secondary' }
      },
      size: {
        md: { base: 'text-sm' }
      }
    },
    compoundVariants: [
      { color: '*', size: 'md', class: { base: 'bg-accent' } },
      { color: 'secondary', size: 'md', class: { base: 'ring' } }
    ],
    defaultVariants: { color: 'primary', size: 'md' }
  })

  it('expands the wildcard into one entry per alias, filling in the alias', () => {
    const result = expandColorVariants(theme(), ['primary', 'tertiary', 'neutral'])
    expect(result.variants.color).toEqual({
      primary: { base: '[--ui-accent:var(--ui-primary)]' },
      tertiary: { base: '[--ui-accent:var(--ui-tertiary)]' },
      neutral: { base: '[--ui-accent:var(--ui-neutral)]' },
      secondary: { base: 'own-secondary' }
    })
    expect(result.variants.size).toEqual({ md: { base: 'text-sm' } })
  })

  it('keeps the entry of an alias the group already lists', () => {
    const result = expandColorVariants(theme(), ['primary', 'secondary'])
    expect(result.variants.color.secondary).toEqual({ base: 'own-secondary' })
    expect(Object.keys(result.variants.color)).toEqual(['primary', 'secondary'])
  })

  it('expands a wildcard compound value into the list of aliases', () => {
    const result = expandColorVariants(theme(), ['primary', 'neutral'])
    expect(result.compoundVariants).toEqual([
      { color: ['primary', 'neutral'], size: 'md', class: { base: 'bg-accent' } },
      { color: 'secondary', size: 'md', class: { base: 'ring' } }
    ])
  })

  it('leaves a wildcard compound off the aliases the group styles on its own', () => {
    const result = expandColorVariants(theme(), ['primary', 'secondary', 'neutral'])
    expect(result.compoundVariants[0].color).toEqual(['primary', 'neutral'])
  })

  it('does not mutate the input theme', () => {
    const input = theme()
    expandColorVariants(input, ['primary'])
    expect(input).toEqual(theme())
  })
})
