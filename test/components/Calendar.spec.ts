import { afterAll, describe, expect, it, test, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { CalendarDate } from '@internationalized/date'
import { ref } from 'vue'
import type { Locale } from '../../src/runtime/types/locale'
import Calendar from '../../src/runtime/components/Calendar.vue'
import type { CalendarSlots } from '../../src/runtime/components/Calendar.vue'
import { renderEach } from '../component-render'
import theme from '#build/ui/calendar'
import en from '../../src/runtime/locale/en'
import fr from '../../src/runtime/locale/fr'

type HeadingSlotProps = Parameters<NonNullable<CalendarSlots['heading']>>[0]
type MonthCellSlotProps = Parameters<NonNullable<CalendarSlots['month-cell']>>[0]
type YearCellSlotProps = Parameters<NonNullable<CalendarSlots['year-cell']>>[0]

describe('Calendar', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
  const date = new Date('2025-01-01')

  vi.setSystemTime(date)

  afterAll(() => {
    vi.useRealTimers()
  })

  renderEach(Calendar, [
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
    ['without fixedWeeks', { props: { fixedWeeks: false } }],
    ['without monthControls', { props: { monthControls: false } }],
    ['without yearControls', { props: { yearControls: false } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant, defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ['with color neutral', { props: { color: 'neutral' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'max-w-sm' } }],
    ['with ui', { props: { ui: { header: 'gap-4' } } }],
    ['with heading slot', { slots: { heading: () => 'Heading' } }],
    ['with day slot', { slots: { day: ({ day }) => day.day } }],
    ['with week-day slot', { slots: { 'week-day': ({ day }) => day } }]
  ])

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = await mountSuspended(Calendar)
      const value = new CalendarDate(2025, 1, 1)

      await wrapper.setValue(value)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[value]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { range: true } })
      const value = { start: new CalendarDate(2025, 1, 1), end: new CalendarDate(2025, 1, 2) }

      await wrapper.setValue(value)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[value]] })
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

  describe('type prop', () => {
    test('type="month" emits update:modelValue on month select', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: {
          type: 'month',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })

      const monthButtons = wrapper.findAll('[data-slot="monthCellTrigger"]')
      expect(monthButtons).toHaveLength(12)

      await monthButtons[5]!.trigger('click')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatchObject({ month: 6 })
    })

    test('type="year" emits update:modelValue on year select', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: {
          type: 'year',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })

      const yearButtons = wrapper.findAll('[data-slot="yearCellTrigger"]')
      expect(yearButtons).toHaveLength(12)

      await yearButtons[0]!.trigger('click')

      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted?.[0]?.[0]).toMatchObject({ year: 2020 })
    })

    test('placeholder falls back to modelValue before today for month and year pickers', async () => {
      let monthDate: CalendarDate | null = null
      let yearDate: CalendarDate | null = null

      await mountSuspended(Calendar, {
        props: {
          type: 'month',
          modelValue: new CalendarDate(2023, 7, 1)
        },
        slots: {
          heading: ({ date }: HeadingSlotProps) => {
            monthDate = date as CalendarDate
            return 'heading'
          }
        }
      })

      await mountSuspended(Calendar, {
        props: {
          type: 'year',
          defaultValue: new CalendarDate(2032, 1, 1)
        },
        slots: {
          heading: ({ date }: HeadingSlotProps) => {
            yearDate = date as CalendarDate
            return 'heading'
          }
        }
      })

      expect(monthDate).toMatchObject({ year: 2023, month: 7 })
      expect(yearDate).toMatchObject({ year: 2032 })
    })

    test('month-cell and year-cell slots receive picker data', async () => {
      const monthWrapper = await mountSuspended(Calendar, {
        props: { type: 'month', defaultValue: new CalendarDate(2025, 1, 1) },
        slots: {
          'month-cell': ({ month }: MonthCellSlotProps) => `M${month.month}`
        }
      })

      const yearWrapper = await mountSuspended(Calendar, {
        props: { type: 'year', defaultValue: new CalendarDate(2025, 1, 1) },
        slots: {
          'year-cell': ({ year }: YearCellSlotProps) => `Y${year.year}`
        }
      })

      expect(monthWrapper.text()).toContain('M1')
      expect(yearWrapper.text()).toContain('Y2020')
    })
  })

  describe('view switching', () => {
    test('defaultView renders month and year panels', async () => {
      const monthWrapper = await mountSuspended(Calendar, {
        props: {
          defaultView: 'month',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })
      const yearWrapper = await mountSuspended(Calendar, {
        props: {
          defaultView: 'year',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })

      expect(monthWrapper.find('[data-slot="monthGrid"]').exists()).toBe(true)
      expect(monthWrapper.find('[data-slot="grid"]').exists()).toBe(false)
      expect(yearWrapper.find('[data-slot="yearGrid"]').exists()).toBe(true)
      expect(yearWrapper.find('[data-slot="grid"]').exists()).toBe(false)
    })

    test('clicking the heading switches day -> month -> year', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: { defaultValue: new CalendarDate(2025, 1, 1) }
      })

      expect(wrapper.find('[data-slot="grid"]').exists()).toBe(true)

      const dayButtons = wrapper.findAll('[data-slot="heading"] button')
      await dayButtons[0]!.trigger('click')

      expect(wrapper.find('[data-slot="monthGrid"]').exists()).toBe(true)

      const monthButtons = wrapper.findAll('[data-slot="heading"] button')
      await monthButtons[1]!.trigger('click')

      expect(wrapper.find('[data-slot="yearGrid"]').exists()).toBe(true)
    })

    test('selecting a month returns to day view and emits update:placeholder once', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: {
          defaultView: 'month',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })

      const monthButtons = wrapper.findAll('[data-slot="monthCellTrigger"]')
      await monthButtons[5]!.trigger('click')

      expect(wrapper.find('[data-slot="grid"]').exists()).toBe(true)

      const placeholderEvents = wrapper.emitted('update:placeholder') ?? []
      expect(placeholderEvents).toHaveLength(1)
      expect(placeholderEvents[0]?.[0]).toMatchObject({ month: 6 })
    })

    test('selecting a year returns to month view and emits update:placeholder once', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: {
          defaultView: 'year',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })

      const yearButtons = wrapper.findAll('[data-slot="yearCellTrigger"]')
      await yearButtons[0]!.trigger('click')

      expect(wrapper.find('[data-slot="monthGrid"]').exists()).toBe(true)

      const placeholderEvents = wrapper.emitted('update:placeholder') ?? []
      expect(placeholderEvents).toHaveLength(1)
      expect(placeholderEvents[0]?.[0]).toMatchObject({ year: 2020, month: 1 })
    })

    test('day month navigation emits update:placeholder once per action', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: {
          defaultValue: new CalendarDate(2025, 1, 1),
          yearControls: false
        }
      })

      await wrapper.find('[aria-label="Next month"]').trigger('click')

      const placeholderEvents = wrapper.emitted('update:placeholder') ?? []
      expect(placeholderEvents).toHaveLength(1)
    })

    test('emits update:view while switching views', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: { defaultValue: new CalendarDate(2025, 1, 1) }
      })

      const headingButtons = wrapper.findAll('[data-slot="heading"] button')
      await headingButtons[0]!.trigger('click')

      expect(wrapper.emitted('update:view')?.[0]).toEqual(['month'])
    })

    test('changing defaultView after mount does not reset uncontrolled view', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: { defaultValue: new CalendarDate(2025, 1, 1) }
      })

      const headingButtons = wrapper.findAll('[data-slot="heading"] button')
      await headingButtons[0]!.trigger('click')
      await wrapper.findAll('[data-slot="heading"] button')[1]!.trigger('click')

      expect(wrapper.find('[data-slot="yearGrid"]').exists()).toBe(true)

      await wrapper.setProps({ defaultView: 'month' })

      expect(wrapper.find('[data-slot="yearGrid"]').exists()).toBe(true)
      expect(wrapper.find('[data-slot="monthGrid"]').exists()).toBe(false)
    })

    test('type="month" keeps the standalone picker heading static', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: {
          type: 'month',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })

      expect(wrapper.find('[data-slot="monthGrid"]').exists()).toBe(true)
      expect(wrapper.find('[data-slot="heading"] button').exists()).toBe(false)
    })

    test('type="month" forwards root props to the picker root', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: {
          type: 'month',
          as: 'section',
          defaultValue: new CalendarDate(2025, 1, 1)
        }
      })

      expect(wrapper.find('[data-slot="root"]').element.tagName).toBe('SECTION')
    })
  })

  describe('labels', () => {
    test('uses fallback text for switch aria labels when locale keys are missing', async () => {
      const wrapper = await mountSuspended(Calendar, {
        props: { defaultValue: new CalendarDate(2025, 1, 1) }
      })

      const headingButtons = wrapper.findAll('[data-slot="heading"] button')
      expect(headingButtons[0]!.attributes('aria-label')).toContain('Switch to month view')
      expect(headingButtons[1]!.attributes('aria-label')).toContain('Switch to year view')
    })

    test('updates formatter output when locale changes', async () => {
      vi.resetModules()

      const { default: AppComponent } = await import('../../src/runtime/components/App.vue')
      const { default: CalendarComponent } = await import('../../src/runtime/components/Calendar.vue')
      const locale = ref<Locale<any>>(en)
      const wrapper = await mountSuspended({
        components: {
          UApp: AppComponent,
          UCalendar: CalendarComponent
        },
        setup() {
          return {
            locale,
            CalendarDate
          }
        },
        template: `
          <UApp :locale="locale">
            <UCalendar :default-value="new CalendarDate(2025, 1, 1)" />
          </UApp>
        `
      })

      const getMonthLabel = () => wrapper.findAll('[data-slot="heading"] button')[0]!.text()

      expect(getMonthLabel()).toBe('January')

      locale.value = fr as Locale<any>
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(getMonthLabel().toLowerCase()).toBe('janvier')
    })
  })
})
