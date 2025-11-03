import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageColumns from '../../src/runtime/components/PageColumns.vue'
import type { PageColumnsProps, PageColumnsSlots } from '../../src/runtime/components/PageColumns.vue'
import ComponentRender from '../component-render'

describe('PageColumns', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'xl:columns-4' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PageColumnsProps, slots?: Partial<PageColumnsSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PageColumns)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageColumns, {
      slots: {
        default: () => 'Default slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
