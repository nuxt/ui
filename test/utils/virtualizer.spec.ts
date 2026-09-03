import { describe, it, expect } from 'vitest'
import { getEstimateSize } from '../../src/runtime/utils/virtualizer'

describe('getEstimateSize', () => {
  it('returns the size matching the theme size', () => {
    expect(getEstimateSize([{ label: 'foo' }], 'xs')(0)).toBe(24)
    expect(getEstimateSize([{ label: 'foo' }], 'xl')(0)).toBe(40)
  })

  it('falls back to the `md` size for a custom theme size', () => {
    expect(getEstimateSize([{ label: 'foo' }], 'xxs')(0)).toBe(32)
  })

  it('falls back to the `md` size for a custom theme size with a description', () => {
    const items = [{ label: 'foo', description: 'bar' }]

    expect(getEstimateSize(items, 'xxs', 'description')(0)).toBe(52)
    expect(getEstimateSize(items, 'xxs', undefined, true)(0)).toBe(52)
  })

  it('uses the larger size only for items that have a description', () => {
    const items = [{ label: 'foo', description: 'bar' }, { label: 'baz' }]
    const estimateSize = getEstimateSize(items, 'md', 'description')

    expect(estimateSize(0)).toBe(52)
    expect(estimateSize(1)).toBe(32)
  })
})
