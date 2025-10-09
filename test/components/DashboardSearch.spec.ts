import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardSearch from '../../src/runtime/components/DashboardSearch.vue'
import type { DashboardSearchProps } from '../../src/runtime/components/DashboardSearch.vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

const DashboardWrapper = defineComponent({
  components: {
    UDashboardGroup: DashboardGroup as any,
    UDashboardSearch: DashboardSearch as any
  },
  inheritAttrs: false,
  template: `<UDashboardGroup>
  <UDashboardSearch v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UDashboardSearch>
</UDashboardGroup>`
})

describe('DashboardSearch', () => {
  const groups = [{
    id: 'links',
    label: 'Go to',
    items: [{
      label: 'Home',
      to: '/'
    }]
  }]

  const props = { groups, open: true, portal: false }

  it.each([
    // Props
    ['with groups', { props }],
    ['with icon', { props: { ...props, icon: 'i-lucide-home' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-lucide-loading' } }],
    ['without colorMode', { props: { ...props, colorMode: false } }],
    ['with fullscreen', { props: { ...props, fullscreen: true } }],
    ['with ui', { props: { ...props, ui: { input: '[&>input]:text-lg' } } }],
    ['with class', { props: { ...props, class: 'sm:max-w-5xl' } }]
  ])('renders %s correctly', async (_: string, options: { props?: DashboardSearchProps }) => {
    const wrapper = await mountSuspended(DashboardWrapper, options)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
