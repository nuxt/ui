import { describe, it, expect } from 'vitest'
import Timeline, { type TimelineProps, type TimelineSlots } from '../../src/runtime/components/Timeline.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/timeline'

describe('Timeline', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    {
      title: 'John Doe',
      description: 'added label "backlog"',
      icon: 'i-lucide-tag',
      value: 'backlog'
    },
    {
      title: 'Benjamin Canac',
      description: 'Assigned to Benjamin Canac',
      icon: 'i-lucide-user-check',
      value: 'assigned'
    },
    {
      title: 'Benjamin Canac',
      description: 'Moved this to "in progress"',
      icon: 'i-lucide-loader',
      value: 'in-progress'
    },
    {
      title: 'John Doe',
      description: 'Moved this to "done"',
      value: 'done'
    }
  ]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with activeValue', { props: { ...props, activeValue: 'assigned' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'gap-8' } }],
    ['with ui', { props: { ...props, ui: { itemTitle: 'font-bold' } } }],
    ['with neutral color', { props: { ...props, color: 'neutral' } }],
    ...sizes.map((size: string) => [`with size ${size} horizontal`, { props: { ...props, size } }]),
    ...sizes.map((size: string) => [`with size ${size} vertical`, { props: { ...props, size, orientation: 'vertical' } }]),
    // Slots
    ['with indicator slot', { props, slots: { indicator: () => 'Indicator slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TimelineProps, slots?: Partial<TimelineSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Timeline)
    expect(html).toMatchSnapshot()
  })
})
