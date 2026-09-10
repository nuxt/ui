import { describe, it, expect, beforeEach } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Link from '../../src/runtime/vue/overrides/inertia/Link.vue'
import Button from '../../src/runtime/components/Button.vue'
import { setPageUrl } from '../utils/inertia'

describe('Link (inertia)', () => {
  beforeEach(() => {
    setPageUrl('/')
  })

  describe('aria-current', () => {
    it('is set when the link points at the current page', async () => {
      setPageUrl('/inventory')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    })

    it('honours a custom ariaCurrentValue', async () => {
      setPageUrl('/checkout/payment')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/checkout/payment', ariaCurrentValue: 'step' },
        slots: { default: () => 'Payment' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('step')
    })

    it('is absent — not "false" — when the link points elsewhere', async () => {
      setPageUrl('/orders')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    })

    it('is not set on a link to the section index from a page inside it', async () => {
      setPageUrl('/inventory/create')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', activeClass: 'is-active' },
        slots: { default: () => 'Cancel' }
      })

      // The link is active — it is the section being browsed — but it is not
      // the page the user is on, so it must not announce itself as current.
      expect(wrapper.find('a').classes()).toContain('is-active')
      expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    })

    it('ignores the query string and hash of the current url', async () => {
      setPageUrl('/inventory?search=x&page=2#results')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    })

    it('is exposed to the custom slot', async () => {
      setPageUrl('/inventory')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', custom: true },
        slots: { default: (props: any) => `aria-current: ${props['aria-current']}` }
      })

      expect(wrapper.text()).toContain('aria-current: page')
    })
  })

  describe('ariaCurrentValue is not forwarded to the DOM', () => {
    it('does not leak on a link', async () => {
      setPageUrl('/inventory')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.html()).not.toContain('ariacurrentvalue')
    })

    it('does not leak on a component that renders no link at all', async () => {
      const wrapper = await mountSuspended(Button, {
        props: { label: 'No link' }
      })

      expect(wrapper.find('button').exists()).toBe(true)
      expect(wrapper.html()).not.toContain('ariacurrentvalue')
    })
  })

  describe('active matching', () => {
    it('ignores the query string on the current url', async () => {
      setPageUrl('/inventory?search=x&page=2')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', activeClass: 'is-active' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').classes()).toContain('is-active')
    })

    it('respects segment boundaries', async () => {
      setPageUrl('/inventory-adjustments')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', activeClass: 'is-active' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').classes()).not.toContain('is-active')
    })

    it('matches a descendant path when not exact', async () => {
      setPageUrl('/inventory/42/edit')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', activeClass: 'is-active' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').classes()).toContain('is-active')
    })

    it('does not match a descendant path when exact', async () => {
      setPageUrl('/inventory/42/edit')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', exact: true, activeClass: 'is-active' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').classes()).not.toContain('is-active')
    })

    it('ignores a trailing slash', async () => {
      setPageUrl('/inventory/')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', activeClass: 'is-active' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').classes()).toContain('is-active')
      expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    })

    it('keeps exact as a raw url comparison', async () => {
      setPageUrl('/inventory?search=x')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', exact: true, activeClass: 'is-active' },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').classes()).not.toContain('is-active')
      expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    })
  })

  describe('hrefs with no path portion', () => {
    // A query- or fragment-only href addresses the current page rather than a
    // path, so it has nothing to match against and must never be treated as a
    // path match. Collapsing it to `/` would make every such link active on
    // every page, since any url starts with `/`.
    it('does not make a query-only link active', async () => {
      setPageUrl('/orders')

      const wrapper = await mountSuspended(Link, {
        props: { to: '?tab=refunds', activeClass: 'is-active' },
        slots: { default: () => 'Refunds' }
      })

      expect(wrapper.find('a').classes()).not.toContain('is-active')
      expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    })

    it('does not make a fragment-only link active', async () => {
      setPageUrl('/orders')

      const wrapper = await mountSuspended(Link, {
        props: { to: '#summary', activeClass: 'is-active' },
        slots: { default: () => 'Summary' }
      })

      expect(wrapper.find('a').classes()).not.toContain('is-active')
      expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    })

    it('does not make a query-only link active on the root page either', async () => {
      setPageUrl('/')

      const wrapper = await mountSuspended(Link, {
        props: { to: '?tab=refunds', activeClass: 'is-active' },
        slots: { default: () => 'Refunds' }
      })

      expect(wrapper.find('a').classes()).not.toContain('is-active')
      expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    })

    it('keeps sibling tab links from all reporting active at once', async () => {
      setPageUrl('/orders')

      const tabs = await Promise.all(['?tab=open', '?tab=refunds', '?tab=closed'].map(to =>
        mountSuspended(Link, {
          props: { to, activeClass: 'is-active' },
          slots: { default: () => to }
        })
      ))

      expect(tabs.filter(tab => tab.find('a').classes().includes('is-active'))).toHaveLength(0)
    })
  })

  it('passes accessibility tests', async () => {
    setPageUrl('/inventory')

    const wrapper = await mountSuspended(Link, {
      props: { to: '/inventory' },
      slots: { default: () => 'Inventory' }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
