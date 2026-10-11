import { ref, shallowRef, computed, toValue, nextTick, watch } from 'vue'
import type { MaybeRefOrGetter, Ref, ComputedRef } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import type { ReferenceElement } from 'reka-ui'

export interface TourStep {
  /**
   * The element this step points to. Accepts:
   * - a bare id (`'id'`) — a plain word is always treated as an id, never as a tag selector
   * - any CSS selector (`'#id'`, `'.class'`, `'[data-tour="step"]'`, …)
   * - an element or a virtual element (anything with `getBoundingClientRect`)
   * - a ref or a getter returning any of the above
   *
   * Omit or pass `null` to anchor the step to the center of the viewport
   * (useful for intro / summary steps with no target).
   */
  target?: MaybeRefOrGetter<string | ReferenceElement | null | undefined>
  /**
   * Any other fields (title, body, side, …) are passed through untouched
   * and available via `current` — you own the rendering and copy.
   */
  [key: string]: any
}

export interface UseTourOptions {
  /**
   * The step index the tour starts on.
   * @defaultValue 0
   */
  initialStep?: number
  /**
   * Loop back to the first step after the last one.
   * @defaultValue false
   */
  loop?: boolean
  /**
   * Scroll the target into view when a step becomes active.
   * @defaultValue true
   */
  scrollIntoView?: boolean | ScrollIntoViewOptions
}

export interface TourRect {
  top: number
  left: number
  width: number
  height: number
}

export interface UseTourReturn {
  /** Whether the tour is currently open. */
  open: Ref<boolean>
  /** The current step index (clamped to the steps range). */
  index: Ref<number>
  /** The current step object, or `undefined` when there are no steps. */
  current: ComputedRef<TourStep | undefined>
  /** The resolved anchor for the current step, to pass to `<UPopover :reference>`. */
  reference: ComputedRef<ReferenceElement | undefined>
  /**
   * The viewport-relative box of the current target (same space as `position: fixed`), kept in sync
   * on scroll and resize. `null` when the tour is closed, the step is centered or the target is not found.
   */
  rect: Readonly<Ref<TourRect | null>>
  /** Total number of steps. */
  total: ComputedRef<number>
  /** Whether a next step exists. */
  hasNext: ComputedRef<boolean>
  /** Whether a previous step exists. */
  hasPrev: ComputedRef<boolean>
  /** Open the tour, optionally at a given index. */
  start: (index?: number) => void
  /** Go to the next step (loops or finishes at the end depending on `loop`). */
  next: () => void
  /** Go to the previous step. */
  prev: () => void
  /** Jump to a specific step and open the tour. */
  goTo: (index: number) => void
  /** Close the tour. */
  finish: () => void
}

/**
 * Drive a guided tour with a single `<UPopover>` whose anchor moves between steps.
 *
 * @example
 * ```ts
 * const tour = useTour([
 *   { target: '#cta', title: 'Get started' },
 *   { target: () => card.value, title: 'Profile', side: 'right' },
 *   { target: null, title: 'All set' } // centered, no target
 * ])
 * ```
 * ```vue
 * <UPopover :open="tour.open.value" :reference="tour.reference.value">
 *   <template #content>…your content + buttons…</template>
 * </UPopover>
 * ```
 */
export function useTour(steps: MaybeRefOrGetter<TourStep[]>, options: UseTourOptions = {}): UseTourReturn {
  const { loop = false, scrollIntoView = true } = options

  const stepList = computed<TourStep[]>(() => toValue(steps) ?? [])
  const total = computed(() => stepList.value.length)

  const open = ref(false)
  const rawIndex = ref(options.initialStep ?? 0)

  function clamp(value: number): number {
    return Math.min(Math.max(value, 0), Math.max(total.value - 1, 0))
  }

  const index = computed<number>({
    get: () => clamp(rawIndex.value),
    set: value => (rawIndex.value = clamp(value))
  })

  const current = computed(() => stepList.value[index.value])
  const hasNext = computed(() => index.value < total.value - 1)
  const hasPrev = computed(() => index.value > 0)

  // A virtual element centered in the viewport, for steps without a target.
  const centerAnchor: ReferenceElement = {
    getBoundingClientRect() {
      const x = typeof window === 'undefined' ? 0 : window.innerWidth / 2
      const y = typeof window === 'undefined' ? 0 : window.innerHeight / 2
      return { x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0, toJSON: () => ({}) } as DOMRect
    }
  }

  const reference = computed<ReferenceElement | undefined>(() => {
    if (!open.value || typeof window === 'undefined') {
      return undefined
    }

    const target = toValue(current.value?.target)
    if (target == null) {
      return centerAnchor
    }

    if (typeof target === 'string') {
      // A plain word is id-only so `'header'` means `#header`, never the `<header>` tag.
      if (/^[\w-]+$/.test(target)) {
        return document.getElementById(target) ?? undefined
      }
      try {
        return (document.querySelector(target) as ReferenceElement | null) ?? undefined
      } catch {
        // Ignore malformed selectors and leave the step unanchored.
        return undefined
      }
    }

    return target
  })

  const rect = shallowRef<TourRect | null>(null)

  function updateRect() {
    const el = reference.value
    // The center anchor only positions the popover, there is no target to highlight.
    // A cached target removed from the DOM would measure as an empty box at the origin.
    if (!el || el === centerAnchor || (el instanceof Element && !el.isConnected)) {
      rect.value = null
      return
    }
    const { top, left, width, height } = el.getBoundingClientRect()
    rect.value = { top, left, width, height }
  }

  // Track the target only while the tour is open. Scroll events do not bubble,
  // so a capture listener on window is what catches scrolling of any container.
  const listenerTarget = () => (open.value && typeof window !== 'undefined' ? window : undefined)
  useEventListener(listenerTarget, 'scroll', updateRect, { capture: true, passive: true })
  useEventListener(listenerTarget, 'resize', updateRect, { passive: true })
  useResizeObserver(() => {
    const el = reference.value
    // Short-circuit before `instanceof`: `Element` does not exist during SSR, where `reference` is always undefined.
    return el && el instanceof Element ? el as HTMLElement : undefined
  }, updateRect)

  function scrollTargetIntoView() {
    if (!scrollIntoView) {
      return
    }
    const el = reference.value
    if (el instanceof Element) {
      el.scrollIntoView(typeof scrollIntoView === 'object' ? scrollIntoView : { behavior: 'smooth', block: 'center' })
    }
  }

  function goTo(value: number) {
    index.value = value
    // Don't open with nothing to show — the `total` watcher only reacts to changes,
    // so it can't catch a tour that is started while already empty.
    if (total.value > 0) {
      open.value = true
    }
  }

  function start(value: number = options.initialStep ?? 0) {
    goTo(value)
  }

  function next() {
    if (hasNext.value) {
      index.value++
    } else if (loop) {
      index.value = 0
    } else {
      finish()
    }
  }

  function prev() {
    if (hasPrev.value) {
      index.value--
    }
  }

  function finish() {
    open.value = false
  }

  // Close automatically if the steps disappear while open.
  watch(total, (value) => {
    if (!value) {
      open.value = false
    }
  })

  // Scroll the active target into view on open / step change.
  watch([open, index], () => {
    if (open.value) {
      nextTick(scrollTargetIntoView)
    }
  })

  // Measure once the DOM reflects the new step.
  watch([open, reference], updateRect, { flush: 'post' })

  return {
    open,
    index,
    current,
    reference,
    rect,
    total,
    hasNext,
    hasPrev,
    start,
    next,
    prev,
    goTo,
    finish
  }
}
