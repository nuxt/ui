import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardSidebarToggle from '../../src/runtime/components/DashboardSidebarToggle.vue'
import type { DashboardSidebarToggleProps } from '../../src/runtime/components/DashboardSidebarToggle.vue'

const DashboardWrapper = defineComponent({
  components: {
    UDashboardGroup: DashboardGroup as any,
    UDashboardSidebarToggle: DashboardSidebarToggle as any
  },
  inheritAttrs: false,
  template: `<UDashboardGroup>
  <UDashboardSidebarToggle v-bind="$attrs" />
</UDashboardGroup>`
})

describe('DashboardSidebarToggle', () => {
  it.each([
    // Props
    ['with color', { props: { color: 'primary' as const } }],
    ['with variant', { props: { variant: 'solid' as const } }],
    ['with side', { props: { side: 'right' as const } }],
    ['with class', { props: { class: 'p-3' } }]
  ])('renders %s correctly', async (_: string, options: { props?: DashboardSidebarToggleProps }) => {
    const wrapper = await mountSuspended(DashboardWrapper, options)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardWrapper)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
