import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'

const CONTENTS = ['popover', 'modal-popover', 'tooltip', 'hover-card']

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
      h(PopoverRoot, { open: true }, () => [h(PopoverTrigger, () => 'Open'), h(PopoverContent, () => 'popover')]),
      h(PopoverRoot, { open: true, modal: true }, () => [h(PopoverTrigger, () => 'Open'), h(PopoverContent, () => 'modal-popover')]),
      h(TooltipProvider, () => h(TooltipRoot, { open: true }, () => [h(TooltipTrigger, () => 'Open'), h(TooltipContent, () => 'tooltip')])),
      h(HoverCardRoot, { open: true }, () => [h(HoverCardTrigger, () => 'Open'), h(HoverCardContent, () => 'hover-card')])
    ]
  }), { attachTo: document.body })

  await vi.waitFor(() => {
    const text = document.body.textContent ?? ''
    const missing = CONTENTS.filter(content => !text.includes(content))
    if (missing.length) {
      throw new Error(`Overlay content not rendered: ${missing.join(', ')}`)
    }
  })

  wrapper.unmount()
}
