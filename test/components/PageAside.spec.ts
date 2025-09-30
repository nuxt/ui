import { describe, it, expect } from 'vitest'
import PageAside from '../../src/runtime/components/PageAside.vue'
import type { PageAsideProps, PageAsideSlots } from '../../src/runtime/components/PageAside.vue'
import ComponentRender from '../component-render'

describe('PageAside', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: 'lg:flex' } }],
    ['with ui', { props: { ui: { container: 'absolute' } } }],
    // Slots
    ['with top slot', { slots: { top: () => 'Top slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with bottom slot', { slots: { bottom: () => 'Bottom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageAsideProps, slots?: Partial<PageAsideSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageAside)
    expect(html).toMatchSnapshot()
  })
})
