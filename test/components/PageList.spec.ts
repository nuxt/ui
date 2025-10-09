import { describe, it, expect } from 'vitest'
import PageList from '../../src/runtime/components/PageList.vue'
import type { PageListProps, PageListSlots } from '../../src/runtime/components/PageList.vue'
import ComponentRender from '../component-render'

describe('PageList', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with divide', { props: { divide: true } }],
    ['with class', { props: { class: 'gap-2' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageListProps, slots?: Partial<PageListSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageList)
    expect(html).toMatchSnapshot()
  })
})
