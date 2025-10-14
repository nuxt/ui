import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
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

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageList, {
      props: {
        divide: true
      },
      slots: {
        default: () => 'Default slot'
      }
    })

    expect(await axe(wrapper.element, {
      rules: {
        // "Certain ARIA roles must contain particular children (aria-required-children)"
        //
        // Fix any of the following:
        //  Required ARIA child role not present: listitem
        'aria-required-children': { enabled: false }
      }
    })).toHaveNoViolations()
  })
})
