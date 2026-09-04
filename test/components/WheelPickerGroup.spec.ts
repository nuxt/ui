import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WheelPickerGroup from '../../src/runtime/components/WheelPickerGroup.vue'
import WheelPicker from '../../src/runtime/components/WheelPicker.vue'
import { renderEach } from '../component-render'

describe('WheelPickerGroup', () => {
  renderEach(WheelPickerGroup, [
    ['with default', { props: {} }],
    ['with color', { props: { color: 'primary' } }],
    ['with variant line', { props: { variant: 'line' } }],
    ['with itemHeight', { props: { itemHeight: 44 } }],
    ['with visibleItems', { props: { visibleItems: 7 } }],
    ['with class', { props: { class: 'shadow' } }],
    ['with ui', { props: { ui: { indicator: 'bg-primary/20' } } }],
    ['with default slot', { slots: { default: () => 'Columns' } }]
  ])

  async function mountGroup(groupProps = {}) {
    return mountSuspended({
      components: { WheelPickerGroup, WheelPicker },
      setup() {
        return { groupProps }
      },
      template: `
        <WheelPickerGroup v-bind="groupProps">
          <WheelPicker :items="['A', 'B', 'C']" model-value="A" aria-label="Letters" />
          <WheelPicker :items="['1', '2', '3']" model-value="2" aria-label="Numbers" />
        </WheelPickerGroup>
      `
    })
  }

  it('renders one shared indicator and no per-column indicators', async () => {
    const wrapper = await mountGroup()

    // The group draws the single center indicator.
    const groupIndicators = wrapper.findAll('[data-slot="root"] > [data-slot="indicator"]')
    expect(groupIndicators.length).toBe(1)

    // Columns are "bare" — they must not render their own indicator.
    expect(wrapper.findAll('[role="listbox"] [data-slot="indicator"]').length).toBe(0)
    expect(wrapper.findAll('[role="listbox"]').length).toBe(2)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountGroup()
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
