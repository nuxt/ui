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
    it('is set when the link is exact active', async () => {
      setPageUrl('/inventory')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', exact: true },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    })

    it('honours a custom ariaCurrentValue', async () => {
      setPageUrl('/checkout/payment')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/checkout/payment', exact: true, ariaCurrentValue: 'step' },
        slots: { default: () => 'Payment' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('step')
    })

    it('is absent — not "false" — when the link is not active', async () => {
      setPageUrl('/orders')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', exact: true },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBeUndefined()
    })

    it('is exposed to the custom slot', async () => {
      setPageUrl('/inventory')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', exact: true, custom: true },
        slots: { default: (props: any) => `aria-current: ${props['aria-current']}` }
      })

      expect(wrapper.text()).toContain('aria-current: page')
    })
  })

  describe('ariaCurrentValue is not forwarded to the DOM', () => {
    it('does not leak on a link', async () => {
      setPageUrl('/inventory')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', exact: true },
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
        props: { to: '/inventory', exact: true },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    })

    it('ignores the hash on the current url', async () => {
      setPageUrl('/inventory#section')

      const wrapper = await mountSuspended(Link, {
        props: { to: '/inventory', exact: true },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('page')
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
        props: { to: '/inventory', exact: true },
        slots: { default: () => 'Inventory' }
      })

      expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    })
  })

  it('passes accessibility tests', async () => {
    setPageUrl('/inventory')

    const wrapper = await mountSuspended(Link, {
      props: { to: '/inventory', exact: true },
      slots: { default: () => 'Inventory' }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
