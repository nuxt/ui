import type { PointerDownOutsideEvent } from 'reka-ui';
export interface PointerDownOutsideOptions {
    /**
     * Whether the overlay is in scrollable mode.
     * When true, prevents closing when clicking on the scrollbar.
     */
    scrollable?: boolean;
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
export declare function pointerDownOutside(e: PointerDownOutsideEvent, options?: PointerDownOutsideOptions): void;
