import { describe, it, expect } from 'vitest'
import Timeline, { type TimelineProps, type TimelineSlots } from '../../src/runtime/components/Timeline.vue'
import ComponentRender from '../component-render'

describe('Timeline', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TimelineProps, slots?: Partial<TimelineSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Timeline)
    expect(html).toMatchSnapshot()
  })
})
