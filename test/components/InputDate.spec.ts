import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import { CalendarDate } from '@internationalized/date'
import InputDate from '../../src/runtime/components/InputDate.vue'
import theme from '#build/ui/input-date'

describe('InputDate', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const date = new Date('2025-01-01')

  vi.setSystemTime(date)

  afterAll(() => {
    vi.useRealTimers()
  })

  renderEach(InputDate, [
    // Props
    ['with modelValue', { props: { modelValue: new CalendarDate(2025, 1, 1) } }],
    ['with default value', { props: { defaultValue: new CalendarDate(2025, 1, 1) } }],
    ['with range', { props: { range: true } }],
    ['with range and modelValue', { props: { range: true, modelValue: { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2025, 1, 15) } } }],
    ['with range and defaultValue', { props: { range: true, defaultValue: { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2025, 1, 15) } } }],
    ['with disabled', { props: { disabled: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with isDateUnavailable', { props: { isDateUnavailable: () => true } }],
    ['with minValue', { props: { minValue: new CalendarDate(2025, 1, 1) } }],
    ['with maxValue', { props: { maxValue: new CalendarDate(2025, 1, 31) } }],
    ['with icon', { props: { icon: 'i-lucide-clock' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with separatorIcon', { props: { range: true, separatorIcon: 'i-lucide-arrow-right' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant, defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant} highlight`, { props: { variant, highlight: true, defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral', defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight`, { props: { variant, color: 'neutral', highlight: true, defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'max-w-sm' } }],
    ['with ui', { props: { ui: { header: 'gap-4' } } }],
    // Slots
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
    ['with separator slot', { slots: { separator: () => '=' } }]
  ])

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = await mountSuspended(InputDate)
      const date = new CalendarDate(2025, 1, 1)

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(InputDate, { props: { range: true } })
      const date = { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2025, 1, 2) }

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })

    test('focus and blur events when focus enters and leaves the field, not between segments', async () => {
      const wrapper = await mountSuspended(InputDate)
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
    const wrapper = await mountSuspended(InputDate, {
      props: {
        modelValue: new CalendarDate(2025, 1, 1),
        range: true
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
