import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Header from '../../src/runtime/components/Header.vue'

describe('Header', () => {
  renderEach(Header, [
    // Props
    ['with title', { props: { title: 'Documentation' } }],
    ['with to', { props: { to: '/docs' } }],
    ['with open', { props: { open: true }, slots: { body: () => 'Body slot' } }],
    ['without toggle', { props: { toggle: false } }],
    ['with toggle', { props: { toggle: { color: 'primary', variant: 'solid' } } }],
    ['with toggleSide', { props: { toggleSide: 'left' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'border-b-0' } }],
    ['with ui', { props: { ui: { container: 'gap-1.5' } } }],
    // Slots
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with left slot', { slots: { left: () => 'Left slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with right slot', { slots: { right: () => 'Right slot' } }],
    ['with toggle slot', { slots: { toggle: () => 'Toggle slot' } }],
    ['with top slot', { slots: { top: () => 'Top slot' } }],
    ['with bottom slot', { slots: { bottom: () => 'Bottom slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with menu slot', { props: { open: true }, slots: { menu: () => 'Menu slot' } }]
  ], async (_, options) => {
    const wrapper = await mountSuspended(Header, options)
    await vi.dynamicImportSettled()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('sets `aria-expanded` on the toggle', async () => {
    const wrapper = await mountSuspended(Header)
    const toggle = wrapper.find('[data-slot="header-toggle"]')

    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')

    expect(toggle.attributes('aria-expanded')).toBe('true')
  })

  it('renders the `body` slot in a HeaderMenu under the header', async () => {
    const wrapper = await mountSuspended(Header, { slots: { right: () => 'Right slot', body: () => 'Body slot' } })

    expect(wrapper.find('[data-slot="header-menu"]').exists()).toBe(false)

    await wrapper.find('[data-slot="header-toggle"]').trigger('click')

    expect(wrapper.find('[data-slot="header-menu"]').text()).toBe('Body slot')
    expect(wrapper.findAll('[data-slot="header-right"]')).toHaveLength(1)
    expect(wrapper.findAll('[data-slot="header-toggle"]')).toHaveLength(1)

    await wrapper.find('[data-slot="header-toggle"]').trigger('click')

    expect(wrapper.find('[data-slot="header-menu"]').exists()).toBe(false)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Header, {
      props: {
        title: 'Documentation',
        to: '/docs'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
