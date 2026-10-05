import type { PointerDownOutsideEvent } from 'reka-ui'

export interface PointerDownOutsideOptions {
  /**
   * Whether the overlay is in scrollable mode.
   * When true, prevents closing when clicking on the scrollbar.
   */
  scrollable?: boolean
}

/**
 * Handles `pointerDownOutside` events to prevent overlays from closing in specific scenarios:
 * 1. When the target element is no longer in the DOM (e.g., a toast was dismissed between pointerdown and click on touch devices)
 * 2. When clicking on a scrollbar (only in scrollable mode)
 *
 * Note: Reka UI already handles dismissable layer checks internally via `isLayerExist`,
 * so we don't need to check for `[data-dismissable-layer]` here.
 *
 * @see https://reka-ui.com/docs/components/dialog#disable-close-on-interaction-outside
 */
export function pointerDownOutside(e: PointerDownOutsideEvent, options: PointerDownOutsideOptions = {}) {
  const originalEvent = e.detail.originalEvent
  const target = originalEvent.target as HTMLElement

  // Fix for touch devices: on touch, Reka UI defers the event dispatch to the click event.
  // If the target element was removed from DOM between pointerdown and click (e.g., toast dismissed),
  // we should prevent the overlay from closing.
  // Using `isConnected` instead of `document.body.contains()` to correctly handle Shadow DOM elements.
  if (!target?.isConnected) {
    e.preventDefault()
    return
  }

  // Scrollable mode: prevent closing when clicking on scrollbar
  // FIXME: This is a workaround to prevent the overlay from closing when clicking on the scrollbar https://reka-ui.com/docs/components/dialog#scrollable-overlay but it's not working on Mac OS.
  if (options.scrollable) {
    if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
      e.preventDefault()
    }
  }
}
