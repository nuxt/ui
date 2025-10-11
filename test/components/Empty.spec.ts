import { describe, it, expect } from 'vitest'
import Empty from '../../src/runtime/components/Empty.vue'
import type { EmptyProps, EmptySlots } from '../../src/runtime/components/Empty.vue'
import ComponentRender from '../component-render'

describe('Empty', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with icon', { props: { icon: 'i-lucide-file' } }],
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with actions', { props: { actions: [{ icon: 'i-lucide-plus', label: 'Add' }] } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with top slot', { slots: { top: () => 'Top slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with actions slot', { slots: { actions: () => 'Actions slot' } }],
    ['with bottom slot', { slots: { bottom: () => 'Bottom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: EmptyProps, slots?: Partial<EmptySlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Empty)
    expect(html).toMatchSnapshot()
  })
})
