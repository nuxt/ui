import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
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
    ['with modelValue', { props: { modelValue: new Temporal.PlainDate(2025, 1, 1) } }],
    ['with default value', { props: { defaultValue: new Temporal.PlainDate(2025, 1, 1) } }],
    ['with range', { props: { range: true } }],
    ['with range and modelValue', { props: { range: true, modelValue: { start: new Temporal.PlainDate(2025, 1, 1), end: new Temporal.PlainDate(2025, 1, 2) } } }],
    ['with range and defaultValue', { props: { range: true, defaultValue: { start: new Temporal.PlainDate(2025, 1, 1), end: new Temporal.PlainDate(2025, 1, 2) } } }],
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
    ['with type month and modelValue', { props: { type: 'month', modelValue: new Temporal.PlainDate(2025, 6, 1) } }],
    ['with type month and range', { props: { type: 'month', range: true, modelValue: { start: new Temporal.PlainDate(2025, 2, 1), end: new Temporal.PlainDate(2025, 6, 1) } } }],
    ['with type month and isDateDisabled', { props: { type: 'month', isDateDisabled: () => true } }],
    ['with type month and isDateUnavailable', { props: { type: 'month', isDateUnavailable: () => true } }],
    ['with type year', { props: { type: 'year' } }],
    ['with type year and modelValue', { props: { type: 'year', modelValue: new Temporal.PlainDate(2025, 1, 1) } }],
    ['with type year and range', { props: { type: 'year', range: true, modelValue: { start: new Temporal.PlainDate(2024, 1, 1), end: new Temporal.PlainDate(2027, 1, 1) } } }],
    ['with type year and isDateDisabled', { props: { type: 'year', isDateDisabled: () => true } }],
    ['with type year and isDateUnavailable', { props: { type: 'year', isDateUnavailable: () => true } }],
    ['with type year and yearsPerPage', { props: { type: 'year', yearsPerPage: 20 } }],
    ['without fixedWeeks', { props: { fixedWeeks: false } }],
    ['without monthControls', { props: { monthControls: false } }],
    ['without yearControls', { props: { yearControls: false } }],
    ['without viewControl', { props: { viewControl: false } }],
    ['with viewControl', { props: { viewControl: { color: 'primary', variant: 'soft' } } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant, defaultValue: new Temporal.PlainDate(2025, 1, 15) } }]),
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
      const date = new Temporal.PlainDate(2025, 1, 1)

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { range: true } })
      const date = { start: new Temporal.PlainDate(2025, 1, 1), end: new Temporal.PlainDate(2025, 1, 2) }

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })
  })

  describe('aria', () => {
    test('labels the month and year views of the date calendar', async () => {
      const wrapper = await mountSuspended(Calendar)

      await wrapper.find('[data-slot="calendar-heading"] button').trigger('click')
      expect(wrapper.get('[data-slot="calendar"]').attributes('aria-label')).toMatch(/^Month picker, /)

      await wrapper.find('[data-slot="calendar-heading"] button').trigger('click')
      expect(wrapper.get('[data-slot="calendar"]').attributes('aria-label')).toMatch(/^Year picker, /)
    })
  })

  describe('views', () => {
    test('clamps a controlled view to maxView and restores it when maxView grows', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { view: 'year', maxView: 'month' } })
      const view = () => wrapper.find('[data-reka-calendar-cell-trigger]').attributes('data-view')

      expect(view()).toBe('month')

      await wrapper.setProps({ maxView: 'year' })
      expect(view()).toBe('year')

      await wrapper.setProps({ maxView: 'day' })
      expect(view()).toBe('day')
    })

    test('heading button switches to the month then the year view', async () => {
      const wrapper = await mountSuspended(Calendar)

      expect(wrapper.find('[data-reka-calendar-cell-trigger]').attributes('data-view')).toBe('day')

      await wrapper.find('[data-slot="calendar-heading"] button').trigger('click')
      expect(wrapper.find('[data-reka-calendar-cell-trigger]').attributes('data-view')).toBe('month')

      await wrapper.find('[data-slot="calendar-heading"] button').trigger('click')
      expect(wrapper.find('[data-reka-calendar-cell-trigger]').attributes('data-view')).toBe('year')
      expect(wrapper.emitted('update:view')?.map(([view]) => view)).toEqual(['month', 'year'])
    })

    test('drill-down selection updates placeholder without emitting update:modelValue', async () => {
      const wrapper = await mountSuspended(Calendar)

      await wrapper.find('[data-slot="calendar-heading"] button').trigger('click')
      await wrapper.findAll('[data-reka-calendar-cell-trigger]')[5]!.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.find('[data-reka-calendar-cell-trigger]').attributes('data-view')).toBe('day')

      const placeholders = wrapper.emitted('update:placeholder') as [Temporal.PlainDate][] | undefined
      expect(placeholders).toBeTruthy()
      const placeholder = placeholders!.at(-1)![0]
      expect(placeholder.year).toBe(2025)
      expect(placeholder.month).toBe(6)
    })
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Calendar, {
      props: {
        modelValue: new Temporal.PlainDate(2025, 1, 1),
        range: true,
        multiple: true,
        numberOfMonths: 2
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
