import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import InputTime from '../../src/runtime/components/InputTime.vue'
import theme from '#build/ui/input-time'
import { Time } from '@internationalized/date'

describe('InputTime', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const date = new Date('2025-01-01')

  vi.setSystemTime(date)

  afterAll(() => {
    vi.useRealTimers()
  })

  renderEach(InputTime, [
    // Props
    ['with modelValue', { props: { modelValue: new Time(12, 30) } }],
    ['with default value', { props: { defaultValue: new Time(12, 30) } }],
    ['with placeholder', { props: { placeholder: new Time(12, 30) } }],
    ['with range', { props: { range: true } }],
    ['with range and modelValue', { props: { range: true, modelValue: { start: new Time(12, 30), end: new Time(14, 30) } } }],
    ['with range and defaultValue', { props: { range: true, defaultValue: { start: new Time(12, 30), end: new Time(14, 30) } } }],
    ['with disabled', { props: { disabled: true, modelValue: new Time(12, 30) } }],
    ['with required', { props: { required: true, modelValue: new Time(12, 30) } }],
    ['with readonly', { props: { readonly: true, modelValue: new Time(12, 30) } }],
    ['with hour cycle 24', { props: { hourCycle: 24 as const } }],
    ['with hour cycle 12', { props: { hourCycle: 12 as const } }],
    ['with granularity', { props: { granularity: 'minute' } }],
    ['with hide time zone', { props: { hideTimeZone: true } }],
    ['with max value', { props: { maxValue: new Time(12, 30) } }],
    ['with min value', { props: { minValue: new Time(12, 30) } }],
    ['with icon', { props: { icon: 'i-lucide-clock' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with separatorIcon', { props: { range: true, separatorIcon: 'i-lucide-arrow-right' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant, defaultValue: new Time(12, 30) } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant} highlight`, { props: { variant, highlight: true, defaultValue: new Time(12, 30) } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral', defaultValue: new Time(12, 30) } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight`, { props: { variant, color: 'neutral', highlight: true, defaultValue: new Time(12, 30) } }]),
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'max-w-sm' } }],
    ['with ui', { props: { ui: { base: 'rounded-full' } } }],
    // Slots
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
    ['with separator slot', { slots: { separator: () => '=' } }]
  ])

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = await mountSuspended(InputTime)
      const time = new Time(12, 30)

      await wrapper.setValue(time)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[time]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(InputTime, { props: { range: true } })
      const time = { start: new Time(12, 30), end: new Time(14, 30) }

      await wrapper.setValue(time)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[time]] })
    })

    test('focus and blur events when focus enters and leaves the field, not between segments', async () => {
      const wrapper = await mountSuspended(InputTime)
      const segments = wrapper.findAll('[data-segment]').filter(segment => segment.attributes('data-segment') !== 'literal')
      const [first, second] = segments

      // nudge the mocked clock past mount so Vue's event invoker doesn't skip same-timestamp events
      vi.setSystemTime(new Date(Date.now() + 1000))

      first!.element.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: null }))
      first!.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: second!.element }))
      second!.element.dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: first!.element }))
      second!.element.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))

      expect(wrapper.emitted('focus')).toHaveLength(1)
      expect(wrapper.emitted('blur')).toHaveLength(1)
    })
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(InputTime, {
      props: {
        modelValue: new Time(12, 30)
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
