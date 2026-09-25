import { describe, it, expect } from 'vitest'
import { applyUnstyled, getThemeClasses } from '../../src/utils/theme'
import { applyPrefix, prefixClasses } from '../../src/runtime/utils/prefix'

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

describe('prefixClasses', () => {
  it('prefixes every class', () => {
    expect(prefixClasses('flex  hover:bg-primary\n[&>svg]:size-4', 'tw')).toBe('tw:flex tw:hover:bg-primary tw:[&>svg]:size-4')
  })

  it('leaves a class that already carries the prefix', () => {
    expect(prefixClasses('tw:flex gap-2', 'tw')).toBe('tw:flex tw:gap-2')
  })

  it('returns the string untouched without a prefix', () => {
    expect(prefixClasses('flex gap-2', undefined)).toBe('flex gap-2')
  })
})

describe('applyPrefix', () => {
  const theme = () => ({
    slots: {
      base: 'inline-flex rounded-md',
      label: ['truncate', 'font-medium']
    },
    variants: {
      color: {
        primary: { base: 'bg-primary' },
        neutral: { base: 'bg-inverted', label: 'text-default' }
      }
    },
    compoundVariants: [
      { color: ['primary', 'neutral'], variant: 'solid', class: { base: 'shadow-xs' } }
    ],
    defaultVariants: {
      color: 'primary'
    }
  })

  it('prefixes the slot, variant and compound classes', () => {
    const result = applyPrefix(theme(), 'tw')

    expect(result.slots).toEqual({ base: 'tw:inline-flex tw:rounded-md', label: ['tw:truncate', 'tw:font-medium'] })
    expect(result.variants.color.neutral).toEqual({ base: 'tw:bg-inverted', label: 'tw:text-default' })
    expect(result.compoundVariants[0].class).toEqual({ base: 'tw:shadow-xs' })
  })

  it('keeps the compound matchers and default variants', () => {
    const result = applyPrefix(theme(), 'tw')

    expect(result.compoundVariants[0]).toMatchObject({ color: ['primary', 'neutral'], variant: 'solid' })
    expect(result.defaultVariants).toEqual({ color: 'primary' })
  })

  it('does not mutate the input theme', () => {
    const input = theme()
    applyPrefix(input, 'tw')

    expect(input).toEqual(theme())
  })

  it('returns the theme untouched without a prefix', () => {
    const input = theme()

    expect(applyPrefix(input, undefined)).toBe(input)
  })

  it('lists every class once, prefixed', () => {
    expect(getThemeClasses([theme(), { slots: { base: 'inline-flex' } }], 'tw')).toEqual([
      'tw:bg-inverted',
      'tw:bg-primary',
      'tw:font-medium',
      'tw:inline-flex',
      'tw:rounded-md',
      'tw:shadow-xs',
      'tw:text-default',
      'tw:truncate'
    ])
  })
})
