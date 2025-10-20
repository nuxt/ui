import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Footer from '../../src/runtime/components/Footer.vue'
import type { FooterProps, FooterSlots } from '../../src/runtime/components/Footer.vue'
import ComponentRender from '../component-render'

describe('Footer', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'relative' } }],
    ['with ui', { props: { ui: { container: 'lg:gap-x-1.5' } } }],
    // Slots
    ['with left slot', { slots: { left: () => 'Left slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with right slot', { slots: { right: () => 'Right slot' } }],
    ['with top slot', { slots: { top: () => 'Top slot' } }],
    ['with bottom slot', { slots: { bottom: () => 'Bottom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FooterProps, slots?: Partial<FooterSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Footer)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Footer, {
      slots: {
        default: () => 'Default slot',
        left: () => 'Left slot',
        right: () => 'Right slot',
        top: () => 'Top slot',
        bottom: () => 'Bottom slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
