import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Calendar, { type CalendarProps, type CalendarSlots } from '../../src/runtime/components/Calendar.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/calendar'

describe('Calendar', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const date = new Date('2025-01-01')

  vi.setSystemTime(date)

  afterAll(() => {
    vi.useRealTimers()
  })

  it.each([
    // Props
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    ['with range', { props: { range: true } }],
    ['with disabled', { props: { range: true } }],
    ['with readonly', { props: { range: true } }],
    ['with is date disabled', { props: { isDateDisabled: () => true } }],
    ['with is date unavailable', { props: { isDateUnavailable: () => true } }],
    ['with week starts on', { props: { weekStartsOn: 1 } }],
    ['with weekday format', { props: { weekdayFormat: 'short' } }],
    ['with number of months', { props: { numberOfMonths: 2 } }],
    ['without fixed weeks', { props: { fixedWeeks: false } }],
    ['without year controls', { props: { yearControls: false } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    // Slots
    ['with heading slot', { slots: { heading: () => 'Heading' } }],
    ['with day slot', { slots: { day: ({ day }: Parameters<CalendarSlots['day']>[0]) => day.day } }],
    ['with week-day slot', { slots: { 'week-day': ({ day }: Parameters<CalendarSlots['week-day']>[0]) => day } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CalendarProps, slots?: Partial<CalendarSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Calendar)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event single', async () => {
      const wrapper = await mountSuspended(Calendar)
      const date = new Date('2025-01-01')

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(Calendar, { props: { range: true } })
      const date = [new Date('2025-01-01'), new Date('2025-01-02')]

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })
  })
})
