import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PageGrid from '../../src/runtime/components/PageGrid.vue'

describe('PageGrid', () => {
  renderEach(PageGrid, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'xl:grid-cols-4' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PageGrid, {
      slots: {
        default: () => 'Default slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
