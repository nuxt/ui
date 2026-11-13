import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { axe } from 'vitest-axe'
import { nextTick } from 'vue'
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
    ['with type month and isMonthDisabled', { props: { type: 'month', isMonthDisabled: () => true } }],
    ['with type month and isMonthUnavailable', { props: { type: 'month', isMonthUnavailable: () => true } }],
    ['with type year', { props: { type: 'year' } }],
    ['with type year and modelValue', { props: { type: 'year', modelValue: new CalendarDate(2025, 1, 1) } }],
    ['with type year and range', { props: { type: 'year', range: true, modelValue: { start: new CalendarDate(2024, 1, 1), end: new CalendarDate(2027, 1, 1) } } }],
    ['with type year and isYearDisabled', { props: { type: 'year', isYearDisabled: () => true } }],
    ['with type year and isYearUnavailable', { props: { type: 'year', isYearUnavailable: () => true } }],
    ['with type year and yearsPerPage', { props: { type: 'year', yearsPerPage: 20 } }],
    ['without fixedWeeks', { props: { fixedWeeks: false } }],
    ['without monthControls', { props: { monthControls: false } }],
    ['without yearControls', { props: { yearControls: false } }],
    ['without viewControl', { props: { viewControl: false } }],
    ['with viewControl', { props: { viewControl: { color: 'primary', variant: 'soft' } } }],
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

  describe('aria', () => {
    test('labels the month and year views of the date calendar', async () => {
      const wrapper = await mountSuspended(Calendar)

      await wrapper.find('[data-slot="heading"] button').trigger('click')
      expect(wrapper.get('[data-slot="root"]').attributes('aria-label')).toMatch(/^Month picker, /)

      await wrapper.find('[data-slot="heading"] button').trigger('click')
      expect(wrapper.get('[data-slot="root"]').attributes('aria-label')).toMatch(/^Year picker, /)
    })
  })

  describe('views', () => {
    test('keeps an uncontrolled selection after cycling through the views', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { placeholder: new CalendarDate(2025, 1, 1) } })

      await wrapper.find('[data-reka-calendar-cell-trigger][data-value="2025-01-15"]').trigger('click')
      for (let i = 0; i < 3; i++) {
        await wrapper.find('[data-slot="heading"] button').trigger('click')
      }

      expect(wrapper.find('[data-reka-calendar-cell-trigger][data-selected]').attributes('data-value')).toBe('2025-01-15')
    })

    test('does not bring back a selection cleared by the parent after cycling through the views', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { 'placeholder': new CalendarDate(2025, 1, 1), 'onUpdate:modelValue': (value: any) => wrapper.setProps({ modelValue: value }) } })

      await wrapper.find('[data-reka-calendar-cell-trigger][data-value="2025-01-15"]').trigger('click')
      await wrapper.setProps({ modelValue: undefined })
      for (let i = 0; i < 3; i++) {
        await wrapper.find('[data-slot="heading"] button').trigger('click')
      }

      expect(wrapper.find('[data-reka-calendar-cell-trigger][data-selected]').exists()).toBe(false)
    })

    test('focuses the tab stop after drilling down', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { placeholder: new CalendarDate(2025, 6, 15) }, attachTo: document.body })

      for (let i = 0; i < 2; i++) {
        await wrapper.find('[data-slot="heading"] button').trigger('click')
      }
      const year = wrapper.find('[data-reka-year-picker-cell-trigger][data-value^="2027"]')
      ;(year.element as HTMLElement).focus()
      await year.trigger('click')
      await nextTick()

      expect(document.activeElement?.getAttribute('data-value')).toBe('2027-06-01')
      expect(document.activeElement?.getAttribute('tabindex')).toBe('0')

      wrapper.unmount()
    })

    test('keeps focus inside the calendar when switching views', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { placeholder: new CalendarDate(2025, 1, 1) }, attachTo: document.body })

      const heading = wrapper.find('[data-slot="heading"] button')
      ;(heading.element as HTMLElement).focus()
      await heading.trigger('click')
      await nextTick()
      expect(document.activeElement).toBe(wrapper.find('[data-slot="heading"] button').element)

      const month = wrapper.find('[data-reka-month-picker-cell-trigger][data-value="2025-06-01"]')
      ;(month.element as HTMLElement).focus()
      await month.trigger('click')
      await nextTick()
      expect(document.activeElement?.hasAttribute('data-reka-calendar-cell-trigger')).toBe(true)
      expect(document.activeElement?.hasAttribute('data-focused')).toBe(true)

      wrapper.unmount()
    })

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
      expect(wrapper.find('[data-reka-calendar-cell-trigger]').exists()).toBe(true)

      const placeholders = wrapper.emitted('update:placeholder') as [CalendarDate][] | undefined
      expect(placeholders).toBeTruthy()
      const placeholder = placeholders!.at(-1)![0]
      expect(placeholder.year).toBe(2025)
      expect(placeholder.month).toBe(6)
    })

    test('does not forward day-only props to month and year pickers', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { type: 'month', numberOfMonths: 2, weekdayFormat: 'short' } })

      const root = wrapper.find('[data-slot="root"]')
      expect(root.attributes('fixedweeks')).toBeUndefined()
      expect(root.attributes('numberofmonths')).toBeUndefined()
      expect(root.attributes('weekdayformat')).toBeUndefined()
    })

    test('does not forward month and year props to the day calendar', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { isMonthDisabled: () => true, isYearDisabled: () => true } })

      const root = wrapper.find('[data-slot="root"]')
      expect(root.attributes('ismonthdisabled')).toBeUndefined()
      expect(root.attributes('isyeardisabled')).toBeUndefined()
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
