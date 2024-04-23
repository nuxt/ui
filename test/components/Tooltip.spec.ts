import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { TooltipProvider } from 'radix-vue'
import Tooltip, { type TooltipProps, type TooltipSlots } from '../../src/runtime/components/Tooltip.vue'
import ComponentRender from '../component-render'

const TooltipWrapper = defineComponent({
  components: {
    TooltipProvider,
    UTooltip: Tooltip
  },
  inheritAttrs: false,
  template: '<TooltipProvider><UTooltip v-bind="$attrs"><slot /></UTooltip></TooltipProvider>'
})

describe('Tooltip', () => {
  it.each([
    // Props
    ['with text', { props: { text: 'Tooltip', open: true, portal: false } }],
    ['with arrow', { props: { text: 'Tooltip', arrow: true, open: true, portal: false } }],
    ['with kbds', { props: { text: 'Tooltip', kbds: ['meta', 'K'], open: true, portal: false } }],
    // Slots
    ['with default slot', { props: { text: 'Tooltip', kbds: ['meta', 'K'], open: true, portal: false }, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props: { open: true, portal: false }, slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TooltipProps, slots?: Partial<TooltipSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, TooltipWrapper)
    expect(html).toMatchSnapshot()
  })
})
