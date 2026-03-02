import { describe } from 'vitest'
import ScrollArea from '../../src/runtime/components/ScrollArea.vue'
import { renderEach } from '../component-render'

describe('ScrollArea', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ]

  const props = { items }

  renderEach(ScrollArea, [
    // Props
    ['with items', { props }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' } }],
    ['with orientation horizontal', { props: { ...props, orientation: 'horizontal' } }],
    ['with virtualize boolean', { props: { ...props, virtualize: true } }],
    ['with virtualize object', { props: { ...props, virtualize: { overscan: 5, estimateSize: 50 } } }],
    ['with virtualize gap', { props: { ...props, virtualize: { gap: 10 } } }],
    ['with virtualize padding', { props: { ...props, virtualize: { paddingStart: 20, paddingEnd: 20 } } }],
    ['with virtualize lanes', { props: { ...props, virtualize: { lanes: 3 } } }],
    ['with virtualize scrollMargin', { props: { ...props, virtualize: { scrollMargin: 10 } } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { viewport: 'gap-4' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])
})
