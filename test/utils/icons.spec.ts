import { describe, it, expect } from 'vitest'
import { getClientBundleIcons } from '../../src/utils/icons'
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
    // mis-convert to `svg:...`. Without `@nuxt/icon`'s collection list we can't tell them
    // apart, so we only trust shipped collections (`lucide`) and leave everything else to
    // runtime loading rather than emit a wrong name `@nuxt/icon` would drop and warn about.
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
})
