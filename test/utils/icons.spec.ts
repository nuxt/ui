import { describe, it, expect } from 'vitest'
import { getClientBundleIcons, parseIconName } from '../../src/utils/icons'
import defaultIcons from '../../src/theme/icons'

describe('parseIconName', () => {
  it('parses the colon form for any collection', () => {
    expect(parseIconName('lucide:x')).toEqual(['lucide', 'x'])
    expect(parseIconName('material-symbols:menu')).toEqual(['material-symbols', 'menu'])
    expect(parseIconName('i:lucide:x')).toEqual(['lucide', 'x'])
  })

  it('matches dashed icons against the collection list, longest-first', () => {
    const collections = ['material', 'material-symbols', 'lucide']

    expect(parseIconName('i-lucide-x', collections)).toEqual(['lucide', 'x'])
    expect(parseIconName('i-material-symbols-menu', collections)).toEqual(['material-symbols', 'menu'])
    expect(parseIconName('material-symbols-menu', collections)).toEqual(['material-symbols', 'menu'])
  })

  it('only splits dashed icons on the first dash when `fallback` is set', () => {
    expect(parseIconName('i-acme-icons-logo', ['lucide'])).toBeUndefined()
    expect(parseIconName('i-acme-icons-logo', ['lucide'], true)).toEqual(['acme', 'icons-logo'])
  })

  it('rejects icons without a name or collection', () => {
    expect(parseIconName('heart')).toBeUndefined()
    expect(parseIconName('i-lucide', ['lucide'])).toBeUndefined()
    expect(parseIconName('i-lucide-', ['lucide'])).toBeUndefined()
    expect(parseIconName('lucide:')).toBeUndefined()
    expect(parseIconName(':x')).toBeUndefined()
    expect(parseIconName('')).toBeUndefined()
  })
})

describe('getClientBundleIcons', () => {
  it('converts the default icons to `@nuxt/icon` bundle names', () => {
    const names = getClientBundleIcons(defaultIcons)

    expect(names).toContain('lucide:chevron-down')
    expect(names).toContain('lucide:loader-circle')
    expect(names).toContain('lucide:x')
    // every default icon is a single-word `lucide` collection, so all are bundled
    expect(names).toHaveLength(new Set(Object.values(defaultIcons)).size)
  })

  it('keeps overrides that stay in a shipped (trusted) collection', () => {
    const names = getClientBundleIcons({ loading: 'i-lucide-loader', close: 'lucide:x' })

    expect(names).toContain('lucide:loader')
    expect(names).toContain('lucide:x')
  })

  it('skips overrides from collections Nuxt UI does not ship defaults in', () => {
    // `heroicons` is single-word and would convert safely, but `svg-spinners` would
    // mis-convert to `svg:...`. Without `@nuxt/icon`'s collection list we can't tell them
    // apart, so we only trust shipped collections (`lucide`) and leave everything else to
    // runtime loading rather than emit a wrong name `@nuxt/icon` would drop and warn about.
    const names = getClientBundleIcons({
      check: 'i-heroicons-check',
      loading: 'i-svg-spinners-90-ring',
      menu: 'i-material-symbols-menu',
      close: 'material-symbols:x'
    })

    expect(names).toEqual([])
  })

  it('ignores values that are not icon names', () => {
    const names = getClientBundleIcons({ a: '', b: 'i-', c: 'i-lucide-' })

    expect(names).toEqual([])
  })

  it('returns an empty array when no icons are provided', () => {
    expect(getClientBundleIcons()).toEqual([])
  })
})
