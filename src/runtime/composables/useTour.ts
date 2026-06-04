import { ref, computed, toValue, nextTick, watch } from 'vue'
import type { MaybeRefOrGetter, Ref, ComputedRef } from 'vue'
import type { ReferenceElement } from 'reka-ui'

export interface TourStep {
  /**
   * The element this step points to. Accepts:
   * - a CSS selector (`'#id'`, `'.class'`, or a bare id resolved as `#id`)
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

export interface UseTourReturn {
  /** Whether the tour is currently open. */
  open: Ref<boolean>
  /** The current step index (clamped to the steps range). */
  index: Ref<number>
  /** The current step object, or `undefined` when there are no steps. */
  current: ComputedRef<TourStep | undefined>
  /** The resolved anchor for the current step, to pass to `<UPopover :reference>`. */
  reference: ComputedRef<ReferenceElement | undefined>
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
      const selector = target.startsWith('#') || target.startsWith('.') ? target : `#${target}`
      return (document.querySelector(selector) as ReferenceElement | null) ?? undefined
    }

    return target
  })

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
    open.value = true
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

  return {
    open,
    index,
    current,
    reference,
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
