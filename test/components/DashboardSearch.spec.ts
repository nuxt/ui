import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardSearch from '../../src/runtime/components/DashboardSearch.vue'
import type { DashboardSearchProps } from '../../src/runtime/components/DashboardSearch.vue'
import theme from '#build/ui/dashboard-search'

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
  const sizes = Object.keys(theme.variants.size) as any

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
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with ui', { props: { ...props, ui: { input: '[&>input]:text-lg' } } }],
    ['with class', { props: { ...props, class: 'sm:max-w-5xl' } }]
  ])('renders %s correctly', async (_: string, options: { props?: DashboardSearchProps }) => {
    const wrapper = await mountSuspended(DashboardWrapper, options)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(DashboardWrapper, {
      props
    })

    expect(await axe(wrapper.element, {
      // "ARIA input fields must have an accessible name (aria-input-field-name)"
      //
      // Fix any of the following:
      //  aria-label attribute does not exist or is empty
      //  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
      //  Element has no title attribute
      rules: {
        'aria-input-field-name': { enabled: false }
      }
    })).toHaveNoViolations()
  })
})
