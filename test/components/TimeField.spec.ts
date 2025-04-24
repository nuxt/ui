import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { Time } from '@internationalized/date'
import TimeField, { type TimeFieldProps, type TimeFieldSlots } from '../../src/runtime/components/TimeField.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/time-field'

describe('TimeField', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const defaultTime = new Time(10, 30)

  it.each([
    // Props
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with placeholder', { props: { placeholder: 'Select time...' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with icon', { props: { icon: 'i-lucide-clock' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-lucide-clock' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-clock' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-chevron-down' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-chevron-down' } }],
    ['with loading', { props: { loading: true } }],
    ['with loading trailing', { props: { loading: true, trailing: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with granularity hour', { props: { granularity: 'hour' } }],
    ['with granularity minute', { props: { granularity: 'minute' } }],
    ['with granularity second', { props: { granularity: 'second' } }],
    ['with 12 hour cycle', { props: { hourCycle: 12 } }],
    ['with 24 hour cycle', { props: { hourCycle: 24 } }],
    ['with hideTimeZone', { props: { hideTimeZone: true } }],
    ['with locale', { props: { locale: 'fr-FR' } }],
    ['with minValue', { props: { minValue: new Time(8, 0) } }],
    ['with maxValue', { props: { maxValue: new Time(17, 0) } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral' } }]),
    ['with ariaLabel', { attrs: { 'aria-label': 'Time selector' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'absolute' } }],
    ['with ui', { props: { ui: { base: 'rounded-full' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TimeFieldProps, slots?: Partial<TimeFieldSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, TimeField)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = mount(TimeField, {
        props: {
          modelValue: defaultTime
        }
      })

      // Find the TimeFieldRoot component and trigger update:model-value event
      const timeFieldRoot = wrapper.findComponent({ name: 'TimeFieldRoot' })
      const newTime = new Time(14, 45)

      await timeFieldRoot.vm.$emit('update:model-value', newTime)

      expect(wrapper.emitted()).toHaveProperty('update:modelValue')
      expect(wrapper.emitted()['update:modelValue'][0]).toEqual([newTime])
    })

    test('blur event', async () => {
      const wrapper = mount(TimeField)
      const timeFieldRoot = wrapper.findComponent({ name: 'TimeFieldRoot' })

      await timeFieldRoot.vm.$emit('blur', { type: 'blur' })

      expect(wrapper.emitted()).toHaveProperty('blur')
      expect(wrapper.emitted().blur[0]).toEqual([{ type: 'blur' }])
    })

    test('update:placeholder event', async () => {
      const wrapper = mount(TimeField)
      const timeFieldRoot = wrapper.findComponent({ name: 'TimeFieldRoot' })
      const placeholder = new Time(12, 0)

      await timeFieldRoot.vm.$emit('update:placeholder', placeholder)

      expect(wrapper.emitted()).toHaveProperty('update:placeholder')
      expect(wrapper.emitted()['update:placeholder'][0]).toEqual([placeholder])
    })
  })
})
