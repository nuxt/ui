import { describe, it, expect, vi } from 'vitest'

const { page } = vi.hoisted(() => ({
  page: { url: '/' }
}))

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => page
}))

import { useRoute } from '../../src/runtime/vue/stubs/inertia'

describe('useRoute (inertia stub)', () => {
  it('reflects the current page url', () => {
    page.url = '/about'

    const route = useRoute()

    expect(route.fullPath).toBe('/about')
  })

  it('stays in sync when the page url changes after useRoute() is called', () => {
    page.url = '/'

    const route = useRoute()
    expect(route.fullPath).toBe('/')

    page.url = '/about'
    expect(route.fullPath).toBe('/about')
  })
})
