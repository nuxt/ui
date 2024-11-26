import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Calendar, { type CalendarProps, type CalendarSlots } from '../../src/runtime/components/Calendar.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/calendar'
import { CalendarDate } from '@internationalized/date'

describe('Calendar', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const date = new Date('2025-01-01')

  vi.setSystemTime(date)

  afterAll(() => {
    vi.useRealTimers()
  })

  it.each([
    // Props
    ['with modelValue', { props: { modelValue: new CalendarDate(2025, 1, 1) } }],
    ['with default value', { props: { defaultValue: new CalendarDate(2025, 1, 1) } }],
    ['with range', { props: { range: true } }],
    ['with multiple', { props: { multiple: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with isDateDisabled', { props: { isDateDisabled: () => true } }],
    ['with isDateUnavailable', { props: { isDateUnavailable: () => true } }],
    ['with weekStartsOn', { props: { weekStartsOn: 1 } }],
    ['with weekdayFormat', { props: { weekdayFormat: 'short' } }],
    ['with numberOfMonths', { props: { numberOfMonths: 2 } }],
    ['without fixedWeeks', { props: { fixedWeeks: false } }],
    ['without monthControls', { props: { monthControls: false } }],
    ['without yearControls', { props: { yearControls: false } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with color neutral', { props: { color: 'neutral' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'max-w-sm' } }],
    ['with ui', { props: { ui: { header: 'gap-4' } } }],
    // Slots
    ['with heading slot', { slots: { heading: () => 'Heading' } }],
    ['with day slot', { slots: { day: ({ day }: Parameters<CalendarSlots['day']>[0]) => day.day } }],
    ['with week-day slot', { slots: { 'week-day': ({ day }: Parameters<CalendarSlots['week-day']>[0]) => day } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CalendarProps<false, false>, slots?: Partial<CalendarSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Calendar)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event single', async () => {
      const wrapper = await mountSuspended(Calendar)
      const date = new CalendarDate(2025, 1, 1)

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { range: true } })
      const date = [new CalendarDate(2025, 1, 1), new CalendarDate(2025, 1, 2)]

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })
  })
})
