import { describe, it, expect } from 'vitest'
import Empty from '../../src/runtime/components/Empty.vue'
import type { EmptyProps, EmptySlots } from '../../src/runtime/components/Empty.vue'
import ComponentRender from '../component-render'

describe('Empty', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EmptyProps, slots?: Partial<EmptySlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Empty)
    expect(html).toMatchSnapshot()
  })
})
