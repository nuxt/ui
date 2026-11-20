import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardSidebar from '../../src/runtime/components/DashboardSidebar.vue'
import DashboardSidebarCollapse from '../../src/runtime/components/DashboardSidebarCollapse.vue'
import { renderEach } from '../component-render'

const DashboardWrapper = defineComponent({
  components: {
    UDashboardGroup: DashboardGroup as any,
    UDashboardSidebarCollapse: DashboardSidebarCollapse as any
  },
  inheritAttrs: false,
  template: `<UDashboardGroup>
  <UDashboardSidebarCollapse v-bind="$attrs" />
</UDashboardGroup>`
})

describe('DashboardSidebarCollapse', () => {
  renderEach(
    DashboardWrapper,
    [
    // Props
      ['with color', { props: { color: 'primary' as const } }],
      ['with variant', { props: { variant: 'solid' as const } }],
      ['with side', { props: { side: 'right' as const } }],
      ['with class', { props: { class: 'p-3' } }]
    ],
    async (_, options) => {
      const wrapper = await mountSuspended(DashboardWrapper, options)
      expect(wrapper.html()).toMatchSnapshot()
    }
  )

  it('sets `aria-expanded` from the sidebar state', async () => {
    const wrapper = await mountSuspended(defineComponent({
      components: {
        UDashboardGroup: DashboardGroup as any,
        UDashboardSidebar: DashboardSidebar as any,
        UDashboardSidebarCollapse: DashboardSidebarCollapse as any
      },
      template: `<UDashboardGroup>
  <UDashboardSidebar collapsible :menu="{ portal: false }" />
  <UDashboardSidebarCollapse data-testid="button" />
</UDashboardGroup>`
    }))
    const button = wrapper.find('[data-testid="button"]')

    expect(button.attributes('aria-expanded')).toBe('true')

    await button.trigger('click')

    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardWrapper)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
