import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

const CONTENTS = ['popover', 'modal-popover', 'tooltip', 'hover-card']

// Each content holds a marker of its own, so one rendering can't stand in for another
const marker = (name: string) => h('span', { 'data-preload': name })

/**
 * Reka UI can load the content of Popover, Tooltip and HoverCard on demand, so the first one opened
 * in a test file renders a macrotask after mount while the next ones render right away. Opening each
 * once before the tests keeps assertions made right after mount independent of the test order.
 */
export async function preloadOverlayContent() {
  // Imported when the hook runs, once the Nuxt environment is set up, so it's the module the components use
  const { PopoverRoot, PopoverTrigger, PopoverContent, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent, HoverCardRoot, HoverCardTrigger, HoverCardContent } = await import('reka-ui')
  const wrapper = mount(defineComponent({
    render: () => [
      h(PopoverRoot, { open: true }, () => [h(PopoverTrigger, () => 'Open'), h(PopoverContent, () => marker('popover'))]),
      h(PopoverRoot, { open: true, modal: true }, () => [h(PopoverTrigger, () => 'Open'), h(PopoverContent, () => marker('modal-popover'))]),
      h(TooltipProvider, () => h(TooltipRoot, { open: true }, () => [h(TooltipTrigger, () => 'Open'), h(TooltipContent, () => marker('tooltip'))])),
      h(HoverCardRoot, { open: true }, () => [h(HoverCardTrigger, () => 'Open'), h(HoverCardContent, () => marker('hover-card'))])
    ]
  }), { attachTo: document.body })

  await vi.waitFor(() => {
    const missing = CONTENTS.filter(content => !document.body.querySelector(`[data-preload="${content}"]`))
    if (missing.length) {
      throw new Error(`Overlay content not rendered: ${missing.join(', ')}`)
    }
  })

  wrapper.unmount()
}
