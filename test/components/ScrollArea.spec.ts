import { describe, it, expect } from 'vitest'
import ScrollArea from '../../src/runtime/components/ScrollArea.vue'
import type { ScrollAreaProps, ScrollAreaSlots } from '../../src/runtime/components/ScrollArea.vue'
import ComponentRender from '../component-render'

describe('ScrollArea', () => {
  const testItems = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]

  it.each([
    // Basic Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'custom-class' } }],
    ['with ui', { props: { ui: { root: 'custom-root' } } }],
    ['with items', { props: { items: testItems } }],
    ['with orientation vertical', { props: { orientation: 'vertical' as const } }],
    ['with orientation horizontal', { props: { orientation: 'horizontal' as const } }],

    // Virtualization
    ['with virtualize boolean', { props: { items: testItems, virtualize: true } }],
    ['with virtualize object', { props: { items: testItems, virtualize: { overscan: 5, estimateSize: 50 } } }],
    ['with virtualize gap', { props: { items: testItems, virtualize: { gap: 10 } } }],
    ['with virtualize padding', { props: { items: testItems, virtualize: { paddingStart: 20, paddingEnd: 20 } } }],
    ['with virtualize lanes', { props: { items: testItems, virtualize: { lanes: 3 } } }],

    // Responsive Lanes
    ['with responsive laneWidth', { props: { items: testItems, virtualize: { laneWidth: 200 } } }],
    ['with responsive minLanes', { props: { items: testItems, virtualize: { laneWidth: 200, minLanes: 2 } } }],
    ['with responsive maxLanes', { props: { items: testItems, virtualize: { laneWidth: 200, maxLanes: 6 } } }],
    ['with responsive full config', { props: { items: testItems, virtualize: { laneWidth: 200, minLanes: 1, maxLanes: 4, gap: 12 } } }],

    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ScrollAreaProps<any>, slots?: Partial<ScrollAreaSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, ScrollArea)
    expect(html).toMatchSnapshot()
  })
})
