import { describe, it, expect } from 'vitest'
import Tree, { type TreeProps, type TreeSlots } from '../../src/runtime/components/Tree.vue'
import ComponentRender from '../component-render'

describe('Tree', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TreeProps, slots?: Partial<TreeSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Tree)
    expect(html).toMatchSnapshot()
  })
})
