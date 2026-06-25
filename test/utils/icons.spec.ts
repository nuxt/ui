import { describe, it, expect } from 'vitest'
import { getClientBundleIcons, parseIconName } from '../../src/utils/icons'
import defaultIcons from '../../src/theme/icons'

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
    const names = getClientBundleIcons({ loading: 'i-lucide-loader' })

    expect(names).toContain('lucide:loader')
  })

  it('skips overrides from collections Nuxt UI does not ship defaults in', () => {
    // `heroicons` is single-word and would convert safely, but `svg-spinners` would
    // mis-convert to `svg:...` and break the client bundle. Without `@nuxt/icon`'s
    // collection list we can't tell them apart, so we only trust shipped collections
    // (`lucide`) and leave everything else to runtime loading.
    const names = getClientBundleIcons({
      check: 'i-heroicons-check',
      loading: 'i-svg-spinners-90-ring',
      menu: 'i-material-symbols-menu'
    })

    expect(names).toEqual([])
  })

  it('ignores values that are not icon classes', () => {
    const names = getClientBundleIcons({ a: '', b: 'lucide:x', c: 'i-', d: 'i-lucide-' })

    expect(names).toEqual([])
  })

  it('returns an empty array when no icons are provided', () => {
    expect(getClientBundleIcons()).toEqual([])
  })

  it('drops collections whose data is not installed', () => {
    // `@nuxt/icon` reads icon data from disk at build time and fails the build on a
    // missing collection, so icons are only bundled when their collection is available.
    expect(getClientBundleIcons(defaultIcons, () => false)).toEqual([])
    expect(getClientBundleIcons(defaultIcons, collection => collection === 'lucide').length)
      .toBe(new Set(Object.values(defaultIcons)).size)
  })
})

describe('parseIconName', () => {
  it('parses the user-facing icon forms into `{collection}:{name}`', () => {
    // with or without the `i-` prefix, dash or colon separated
    expect(parseIconName('i-lucide-heart')).toBe('lucide:heart')
    expect(parseIconName('lucide-heart')).toBe('lucide:heart')
    expect(parseIconName('lucide:heart')).toBe('lucide:heart')
    // the colon form is the only way to bundle a multi-word collection
    expect(parseIconName('i-simple-icons:github')).toBe('simple-icons:github')
    expect(parseIconName('material-symbols:menu')).toBe('material-symbols:menu')
  })

  it('returns undefined for values that are not parseable icon names', () => {
    expect(parseIconName('')).toBeUndefined()
    expect(parseIconName('i-')).toBeUndefined()
    expect(parseIconName('i-lucide-')).toBeUndefined()
    expect(parseIconName('lucide:')).toBeUndefined()
    expect(parseIconName('lucide')).toBeUndefined()
    expect(parseIconName(42)).toBeUndefined()
  })
})
