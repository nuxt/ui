import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardPanel from '../../src/runtime/components/DashboardPanel.vue'
import type { DashboardPanelProps, DashboardPanelSlots } from '../../src/runtime/components/DashboardPanel.vue'

const DashboardWrapper = defineComponent({
  components: {
    UDashboardGroup: DashboardGroup as any,
    UDashboardPanel: DashboardPanel as any
  },
  inheritAttrs: false,
  template: `<UDashboardGroup>
  <UDashboardPanel v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UDashboardPanel>
</UDashboardGroup>`
})

describe('DashboardPanel', () => {
  it.each([
    // Props
    ['with id', { props: { id: 'test' } }],
    ['with minSize', { props: { minSize: 10 } }],
    ['with maxSize', { props: { maxSize: 100 } }],
    ['with defaultSize', { props: { defaultSize: 50 } }],
    ['with resizable', { props: { resizable: true } }],
    ['with class', { props: { class: 'lg:border-none' } }],
    ['with ui', { props: { ui: { body: 'p-8' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
    ['with resize-handle slot', { slots: { 'resize-handle': () => 'Resize handle slot' } }]
  ])('renders %s correctly', async (_: string, options: { props?: DashboardPanelProps, slots?: Partial<DashboardPanelSlots> }) => {
    const wrapper = await mountSuspended(DashboardWrapper, options)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardWrapper, {
      props: {
        id: 'test',
        resizable: true
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
