import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'

describe('DashboardGroup', () => {
  renderEach(DashboardGroup, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'inset-4' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardGroup)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
