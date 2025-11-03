import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageGrid from '../../src/runtime/components/PageGrid.vue'
import type { PageGridProps, PageGridSlots } from '../../src/runtime/components/PageGrid.vue'
import ComponentRender from '../component-render'

describe('PageGrid', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'xl:grid-cols-4' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageGridProps, slots?: Partial<PageGridSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageGrid)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageGrid, {
      slots: {
        default: () => 'Default slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
