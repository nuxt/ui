import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PageList from '../../src/runtime/components/PageList.vue'

describe('PageList', () => {
  renderEach(PageList, [
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with divide', { props: { divide: true } }],
    ['with class', { props: { class: 'gap-2' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

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
