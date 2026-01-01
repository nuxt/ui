import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardToolbar from '../../src/runtime/components/DashboardToolbar.vue'
import type { DashboardToolbarProps, DashboardToolbarSlots } from '../../src/runtime/components/DashboardToolbar.vue'
import ComponentRender from '../component-render'

describe('DashboardToolbar', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'px-8' } }],
    ['with ui', { props: { ui: { left: 'items-center' } }, slots: { left: (): string => 'Left slot' } }],
    // Slots
    ['with default slot', { slots: { default: (): string => 'Default slot' } }],
    ['with left slot', { slots: { left: (): string => 'Left slot' } }],
    ['with right slot', { slots: { right: (): string => 'Right slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: DashboardToolbarProps, slots?: Partial<DashboardToolbarSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, DashboardToolbar)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardToolbar)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
