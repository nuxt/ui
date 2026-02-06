import { describe, it, expect, vi, afterAll, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { CalendarDate } from '@internationalized/date'
import InputDate from '../../src/runtime/components/InputDate.vue'
import type { InputDateProps, InputDateSlots } from '../../src/runtime/components/InputDate.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input-date'

describe('InputDate', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any
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
    ['with disabled', { props: { disabled: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with isDateUnavailable', { props: { isDateUnavailable: () => true } }],
    ['with minValue', { props: { minValue: new CalendarDate(2025, 1, 1) } }],
    ['with maxValue', { props: { maxValue: new CalendarDate(2025, 1, 31) } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant, defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral', defaultValue: new CalendarDate(2025, 1, 15) } }]),
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'max-w-sm' } }],
    ['with ui', { props: { ui: { header: 'gap-4' } } }],
    // Slots
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
    ['with separator slot', { slots: { separator: () => '=' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputDateProps, slots?: Partial<InputDateSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputDate)
    expect(html).toMatchSnapshot()
  })

  describe('emits', () => {
    test('update:modelValue event single', async () => {
      const wrapper = await mountSuspended(InputDate)
      const date = new CalendarDate(2025, 1, 1)

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
    })

    test('update:modelValue event range', async () => {
      const wrapper = await mountSuspended(InputDate, { props: { range: true } })
      const date = [new CalendarDate(2025, 1, 1), new CalendarDate(2025, 1, 2)]

      await wrapper.setValue(date)
      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[date]] })
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
