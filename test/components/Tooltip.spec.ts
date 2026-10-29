import type { Component } from 'vue'
import { defineComponent, h } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import { TooltipProvider } from 'reka-ui'
import Tooltip from '../../src/runtime/components/Tooltip.vue'
import Checkbox from '../../src/runtime/components/Checkbox.vue'
import Switch from '../../src/runtime/components/Switch.vue'

const TooltipWrapper = defineComponent({
  components: {
    TooltipProvider,
    UTooltip: Tooltip
  },
  inheritAttrs: false,
  template: `<TooltipProvider>
  <UTooltip v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UTooltip>
</TooltipProvider>`
})

const TooltipProviderContentWrapper = defineComponent({
  components: {
    TooltipProvider,
    UTooltip: Tooltip
  },
  inheritAttrs: false,
  template: `<TooltipProvider :content="{ side: 'right', sideOffset: 12 }">
  <UTooltip v-bind="$attrs">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UTooltip>
</TooltipProvider>`
})

describe('Tooltip', () => {
  const props = { text: 'Tooltip', open: true, portal: false }

  renderEach(TooltipWrapper, [
    // Props
    ['with text', { props }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ['with kbds', { props: { ...props, kbds: ['meta', 'K'] } }],
    ['with class', { props: { ...props, class: 'text-sm' } }],
    ['with ui', { props: { ...props, ui: { content: 'text-sm' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }]
  ])

  it('respects provider content defaults', async () => {
    const wrapper = await mountSuspended(TooltipProviderContentWrapper, {
      props: { text: 'Tooltip', open: true, portal: false }
    })

    const content = wrapper.find('[data-slot="tooltip-content"]')
    expect(content.attributes('data-side')).toBe('right')
  })

  it('allows per-tooltip content to override provider defaults', async () => {
    const wrapper = await mountSuspended(TooltipProviderContentWrapper, {
      props: { text: 'Tooltip', open: true, portal: false, content: { side: 'top' } }
    })

    const content = wrapper.find('[data-slot="tooltip-content"]')
    expect(content.attributes('data-side')).toBe('top')
  })

  it('labels the tooltip with the text and resolved kbds', async () => {
    const wrapper = await mountSuspended(TooltipWrapper, {
      props: { ...props, kbds: ['meta', 'K'] }
    })

    expect(wrapper.find('[role="tooltip"]').text()).toBe('Tooltip Ctrl K')
  })

  it.each([
    ['Checkbox', Checkbox],
    ['Switch', Switch]
  ])('opens when hovering the %s label', async (name, component) => {
    const wrapper = await mountSuspended(defineComponent({
      setup: () => () => h(TooltipProvider, { delayDuration: 0 }, {
        default: () => h(Tooltip, { text: 'Help', portal: false }, {
          default: () => h(component as Component, { label: 'Accept terms' })
        })
      })
    }), { attachTo: document.body })

    await wrapper.find(`[data-slot="${name.toLowerCase()}-label"]`).trigger('pointermove', { pointerType: 'mouse' })

    await vi.waitFor(() => expect(wrapper.find('[role="tooltip"]').exists()).toBe(true))
    wrapper.unmount()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(TooltipWrapper, {
      props: {
        ...props,
        arrow: true,
        kbds: ['meta', 'K']
      }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
