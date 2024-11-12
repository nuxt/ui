import { describe, it, expect } from 'vitest'
import Calendar, { type CalendarProps, type CalendarSlots } from '../../src/runtime/components/Calendar.vue'
import ComponentRender from '../component-render'

describe('Calendar', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CalendarProps, slots?: Partial<CalendarSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Calendar)
    expect(html).toMatchSnapshot()
  })
})
