import { describe, it, expect } from 'vitest'
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
})
