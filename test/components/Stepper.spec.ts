import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Stepper from '../../src/runtime/components/Stepper.vue'
import theme from '#build/ui/stepper'

describe('Stepper', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    {
      title: 'Address',
      description: 'Add your address here',
      icon: 'i-lucide-house'
    }, {
      title: 'Shipping',
      description: 'Set your preferred shipping method',
      icon: 'i-lucide-truck'
    }, {
      slot: 'custom',
      title: 'Checkout',
      description: 'Confirm your order'
    }
  ]

  const props = { items }

  renderEach(Stepper, [
    // Props
    ['with items', { props }],
    ['with defaultValue', { props: { ...props, defaultValue: 1 } }],
    ['with modelValue', { props: { ...props, modelValue: 1 } }],
    ['with valueKey', { props: { ...props, valueKey: 'title', defaultValue: 'Address' } }],
    ['with neutral color', { props: { ...props, color: 'neutral' } }],
    ...sizes.map((size: string) => [`with size ${size} horizontal`, { props: { ...props, size } }]),
    ...sizes.map((size: string) => [`with size ${size} vertical`, { props: { ...props, size, orientation: 'vertical' } }]),
    ['without linear', { props: { ...props, linear: false } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'gap-8' } }],
    ['with ui', { props: { ...props, ui: { title: 'font-bold' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with indicator slot', { props, slots: { indicator: () => 'Indicator slot' } }],
    ['with wrapper slot', { props, slots: { wrapper: () => 'Wrapper slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with custom slot', { props: { ...props, defaultValue: 2 }, slots: { custom: () => 'Custom slot' } }],
    ['with custom-wrapper slot', { props, slots: { 'custom-wrapper': () => 'Custom wrapper slot' } }]
  ])

  it('announces the current step counting from 1', async () => {
    const wrapper = await mountSuspended(Stepper, { props: { items } })

    expect(wrapper.get('[role="status"]').text()).toBe('Step 1 of 3')

    await wrapper.setProps({ modelValue: 2 })

    expect(wrapper.get('[role="status"]').text()).toBe('Step 3 of 3')
  })

  it('announces the current step counting from 1 with valueKey', async () => {
    const wrapper = await mountSuspended(Stepper, { props: { items, valueKey: 'title', modelValue: 'Shipping' } })

    expect(wrapper.get('[role="status"]').text()).toBe('Step 2 of 3')
  })

  it('emits the 0-based index when a step trigger is clicked', async () => {
    const wrapper = await mountSuspended(Stepper, { props: { items, modelValue: 0 } })

    await wrapper.findAll('[data-slot="trigger"]')[1]!.trigger('mousedown', { button: 0 })

    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
    expect(wrapper.findAll('[data-slot="item"]')[1]!.attributes('data-state')).toBe('active')
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Stepper, {
      props: {
        items,
        modelValue: 1
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
