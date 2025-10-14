import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import type { DashboardGroupProps, DashboardGroupSlots } from '../../src/runtime/components/DashboardGroup.vue'
import ComponentRender from '../component-render'

describe('DashboardGroup', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'inset-4' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DashboardGroupProps, slots?: Partial<DashboardGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, DashboardGroup)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardGroup)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
