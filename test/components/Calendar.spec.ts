import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { CalendarDate } from '@internationalized/date'
import { renderEach } from '../component-render'
import Calendar from '../../src/runtime/components/Calendar.vue'
import theme from '#build/ui/calendar'

describe('Calendar', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const date = new Date('2025-01-01')

  vi.setSystemTime(date)

  afterAll(() => {
    vi.useRealTimers()
  })

  renderEach(Calendar, [
    // Props
    ['with modelValue', { props: { modelValue: new CalendarDate(2025, 1, 1) } }],
    ['with default value', { props: { defaultValue: new CalendarDate(2025, 1, 1) } }],
    ['with range', { props: { range: true } }],
    ['with range and modelValue', { props: { range: true, modelValue: { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2025, 1, 2) } } }],
    ['with range and defaultValue', { props: { range: true, defaultValue: { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2025, 1, 2) } } }],
    ['with multiple', { props: { multiple: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with isDateDisabled', { props: { isDateDisabled: () => true } }],
    ['with isDateUnavailable', { props: { isDateUnavailable: () => true } }],
    ['with weekStartsOn', { props: { weekStartsOn: 1 } }],
    ['with weekdayFormat', { props: { weekdayFormat: 'short' } }],
    ['with numberOfMonths', { props: { numberOfMonths: 2 } }],
    ['with nextYear', { props: { nextYear: { size: 'lg', color: 'primary' } } }],
    ['with nextMonth', { props: { nextMonth: { size: 'lg', color: 'primary' } } }],
    ['with prevYear', { props: { prevYear: { size: 'lg', color: 'primary' } } }],
    ['with prevMonth', { props: { prevMonth: { size: 'lg', color: 'primary' } } }],
    ['with weekNumbers', { props: { weekNumbers: true } }],
    ['with type month', { props: { type: 'month' } }],
    ['with type month and modelValue', { props: { type: 'month', modelValue: new CalendarDate(2025, 6, 1) } }],
    ['with type month and range', { props: { type: 'month', range: true, modelValue: { start: new CalendarDate(2025, 2, 1), end: new CalendarDate(2025, 6, 1) } } }],
    ['with type year', { props: { type: 'year' } }],
    ['with type year and modelValue', { props: { type: 'year', modelValue: new CalendarDate(2025, 1, 1) } }],
    ['with type year and range', { props: { type: 'year', range: true, modelValue: { start: new CalendarDate(2024, 1, 1), end: new CalendarDate(2027, 1, 1) } } }],
    ['without fixedWeeks', { props: { fixedWeeks: false } }],
    ['without monthControls', { props: { monthControls: false } }],
    ['without yearControls', { props: { yearControls: false } }],
    ['without viewControls', { props: { viewControls: false } }],
    ['with viewButton', { props: { viewButton: { color: 'primary', variant: 'soft' } } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant, defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ['with color neutral', { props: { color: 'neutral' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'max-w-sm' } }],
    ['with ui', { props: { ui: { header: 'gap-4' } } }],
    // Slots
    ['with heading slot', { slots: { heading: () => 'Heading' } }],
    ['with day slot', { slots: { day: ({ day }) => day.day } }],
    ['with week-day slot', { slots: { 'week-day': ({ day }) => day } }],
    ['with month-cell slot', { props: { type: 'month' }, slots: { 'month-cell': ({ month }) => month.month } }],
    ['with year-cell slot', { props: { type: 'year' }, slots: { 'year-cell': ({ year }) => year.year } }]
  ])

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = await mountSuspended(Calendar)
      const date = new CalendarDate(2025, 1, 1)

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { range: true } })
      const date = { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2025, 1, 2) }

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })
  })

  describe('views', () => {
    test('heading button cycles through day, month and year views', async () => {
      const wrapper = await mountSuspended(Calendar)

      expect(wrapper.find('[data-reka-calendar-cell-trigger]').exists()).toBe(true)

      await wrapper.find('[data-slot="heading"] button').trigger('click')
      expect(wrapper.find('[data-reka-month-picker-cell-trigger]').exists()).toBe(true)

      await wrapper.find('[data-slot="heading"] button').trigger('click')
      expect(wrapper.find('[data-reka-year-picker-cell-trigger]').exists()).toBe(true)

      await wrapper.find('[data-slot="heading"] button').trigger('click')
      expect(wrapper.find('[data-reka-calendar-cell-trigger]').exists()).toBe(true)
    })

    test('drill-down selection updates placeholder without emitting update:modelValue', async () => {
      const wrapper = await mountSuspended(Calendar)

      await wrapper.find('[data-slot="heading"] button').trigger('click')
      await wrapper.find('[data-reka-month-picker-cell-trigger][data-value="2025-06-01"]').trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('update:placeholder')).toBeTruthy()
      expect(wrapper.find('[data-reka-calendar-cell-trigger]').exists()).toBe(true)
      expect(wrapper.find('[data-slot="heading"]').text()).toContain('June 2025')
    })

    test('does not forward day-only props to month and year pickers', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { type: 'month', numberOfMonths: 2, weekdayFormat: 'short' } })

      const root = wrapper.find('[data-slot="root"]')
      expect(root.attributes('fixedweeks')).toBeUndefined()
      expect(root.attributes('numberofmonths')).toBeUndefined()
      expect(root.attributes('weekdayformat')).toBeUndefined()
    })
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Calendar, {
      props: {
        modelValue: new CalendarDate(2025, 1, 1),
        range: true,
        multiple: true,
        numberOfMonths: 2
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
