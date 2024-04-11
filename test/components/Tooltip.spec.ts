import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import { TooltipProvider } from 'radix-vue'
import Tooltip, { type TooltipProps } from '../../src/runtime/components/Tooltip.vue'
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
    ['with text', { props: { text: 'Tooltip', open: true, portal: false } }],
    ['with arrow', { props: { text: 'Tooltip', arrow: true, open: true, portal: false } }],
    ['with shortcuts', { props: { text: 'Tooltip', shortcuts: ['⌘', 'K'], open: true, portal: false } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TooltipProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, TooltipWrapper)
    expect(html).toMatchSnapshot()
  })
})
