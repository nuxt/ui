import { ref, computed, toValue, onScopeDispose } from 'vue'
import type { MaybeRefOrGetter, CSSProperties, InjectionKey } from 'vue'

/**
 * Shared configuration provided by `<UWheelPickerGroup>` to the `<UWheelPicker>`
 * columns it wraps, so every column aligns to the same geometry and the group
 * can draw a single shared frame and center indicator.
 */
export interface WheelPickerGroupContext {
  size: () => any
  color: () => any
  variant: () => any
  itemHeight: () => number | undefined
  visibleItems: () => number | undefined
}

export const wheelPickerGroupInjectionKey: InjectionKey<WheelPickerGroupContext> = Symbol('nuxt-ui.wheel-picker-group')

export interface UseWheelPickerOptions {
  /** Total number of items in the column. */
  count: MaybeRefOrGetter<number>
  /** Height (vertical) or width (horizontal) of a single item, in pixels. */
  itemSize: MaybeRefOrGetter<number>
  /** Number of items visible at once (used to size the viewport and the 3D curvature). */
  visibleItems: MaybeRefOrGetter<number>
  /** Whether the wheel wraps around infinitely. */
  loop?: MaybeRefOrGetter<boolean>
  /** Disable all interactions. */
  disabled?: MaybeRefOrGetter<boolean>
  /** Prevent value changes while keeping the wheel focusable. */
  readonly?: MaybeRefOrGetter<boolean>
  /** Fire a short haptic vibration each time the active item changes. */
  haptics?: MaybeRefOrGetter<boolean>
  /** Enable inertia/momentum after a drag or flick. */
  momentum?: MaybeRefOrGetter<boolean>
  /** Multiplier applied to wheel and drag movement (1 = default). */
  sensitivity?: MaybeRefOrGetter<number>
  /** Snap to the nearest item when scrolling stops. */
  snap?: MaybeRefOrGetter<boolean>
  /** Base duration of the snap animation, in milliseconds. */
  animationDuration?: MaybeRefOrGetter<number>
  /** Lay the wheel out horizontally instead of vertically. */
  horizontal?: MaybeRefOrGetter<boolean>
  /** Right-to-left layout (only affects the horizontal orientation). */
  rtl?: MaybeRefOrGetter<boolean>
  /** Called with the resolved item index whenever the active item changes. */
  onChange?: (index: number) => void
  /** Called when a scroll interaction begins. */
  onScrollStart?: () => void
  /** Called when a scroll interaction ends (after snapping). */
  onScrollEnd?: () => void
}

const MAX_UNIT_ANGLE = 30
const WHEEL_SNAP_DELAY = 120
const MOMENTUM_AMPLITUDE = 90
// Approximate px-per-line for normalizing line-mode wheel events (deltaMode 1).
const WHEEL_LINE_HEIGHT = 16

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Headless state machine powering a single wheel-picker column.
 *
 * The public state is a continuous float `position` expressed in item units:
 * `position === 2` means item 2 is perfectly centered. Selection is always the
 * rounded (and, in loop mode, wrapped) `position`, so it stays correct
 * regardless of the 3D projection used to render the cells. Extracting it as a
 * composable keeps `WheelPicker.vue` declarative and lets a future multi-column
 * picker (date, time, country…) instantiate one engine per column.
 */
export function useWheelPicker(options: UseWheelPickerOptions) {
  const position = ref(0)
  const isScrolling = ref(false)

  let rafId: number | null = null
  let wheelTimer: ReturnType<typeof setTimeout> | null = null
  // Bumped whenever an animation is cancelled/superseded so a stale RAF step
  // (e.g. one revived by an onChange → scrollToIndex re-entry) bails out instead
  // of overwriting `rafId` for the newer animation.
  let animationGeneration = 0

  // Pointer drag bookkeeping.
  let dragging = false
  let pointerId: number | null = null
  let startCoord = 0
  let startPosition = 0
  let lastPosition = 0
  let lastTime = 0
  let velocity = 0
  let target: EventTarget | null = null

  const count = () => Math.max(0, Math.trunc(toValue(options.count)))
  const itemSize = () => Math.max(1, toValue(options.itemSize))
  const sensitivity = () => {
    const value = toValue(options.sensitivity)
    return value && value > 0 ? value : 1
  }
  const isLoop = () => !!toValue(options.loop) && count() > 1
  const isDisabled = () => !!toValue(options.disabled)
  const isReadonly = () => !!toValue(options.readonly)
  const isBlocked = () => isDisabled() || isReadonly()
  const isHorizontal = () => !!toValue(options.horizontal)

  function prefersReducedMotion(): boolean {
    return import.meta.client && typeof matchMedia !== 'undefined'
      && matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /** Resolve the snap duration, collapsing to instant when motion is reduced. */
  function baseDuration(): number {
    if (prefersReducedMotion()) return 0
    return toValue(options.animationDuration) ?? 200
  }

  function momentumEnabled(): boolean {
    return toValue(options.momentum) !== false && !prefersReducedMotion()
  }

  /** Short haptic pulse on item change, when enabled and supported. */
  function haptic() {
    if (!toValue(options.haptics) || !import.meta.client) return
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(8)
    }
  }

  function wrap(value: number): number {
    const n = count()
    if (n <= 0) return 0
    return ((value % n) + n) % n
  }

  function clamp(value: number): number {
    const n = count()
    if (n <= 0) return 0
    return Math.min(Math.max(value, 0), n - 1)
  }

  /** Constrain a raw position, with rubber-band resistance past the edges. */
  function resist(value: number): number {
    if (isLoop()) return value
    const n = count()
    if (n <= 0) return 0
    if (value < 0) return value * 0.3
    if (value > n - 1) return (n - 1) + (value - (n - 1)) * 0.3
    return value
  }

  const activeIndex = computed(() => {
    const n = count()
    if (n <= 0) return -1
    const rounded = Math.round(position.value)
    return isLoop() ? wrap(rounded) : clamp(rounded)
  })

  function cancelAnimation() {
    animationGeneration++
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  function beginScroll() {
    if (!isScrolling.value) {
      isScrolling.value = true
      options.onScrollStart?.()
    }
  }

  function endScroll() {
    if (isScrolling.value) {
      isScrolling.value = false
      options.onScrollEnd?.()
    }
  }

  function emitChange(previous: number) {
    if (activeIndex.value !== previous && activeIndex.value >= 0) {
      haptic()
      options.onChange?.(activeIndex.value)
    }
  }

  /** Animate `position` to a target value using an ease-out curve. */
  function animateTo(to: number, duration: number) {
    cancelAnimation()
    const generation = animationGeneration
    const from = position.value
    const distance = to - from
    const startTime = performance.now()
    const total = Math.max(1, duration)
    let previous = activeIndex.value

    // A no-op move emits nothing.
    if (distance === 0) {
      settle(to)
      return
    }

    // Skip the RAF loop for zero-duration moves (keeps `prefers-reduced-motion`
    // and unit tests fully synchronous) while still emitting scroll events.
    if (duration <= 0) {
      beginScroll()
      settle(to)
      return
    }

    beginScroll()

    const step = (now: number) => {
      // Bail if a newer animation superseded this one.
      if (generation !== animationGeneration) return

      const elapsed = now - startTime
      const t = Math.min(1, elapsed / total)
      position.value = from + distance * easeOutCubic(t)
      emitChange(previous)
      previous = activeIndex.value

      if (t < 1) {
        rafId = requestAnimationFrame(step)
      } else {
        rafId = null
        settle(to)
      }
    }

    rafId = requestAnimationFrame(step)
  }

  /** Land on a resolved integer index, normalizing any loop overflow. */
  function settle(to: number) {
    const previous = activeIndex.value
    const resolved = isLoop() ? wrap(Math.round(to)) : clamp(Math.round(to))
    position.value = resolved
    emitChange(previous)
    endScroll()
  }

  const snapEnabled = () => toValue(options.snap) !== false

  function snapToNearest() {
    animateTo(Math.round(position.value), baseDuration())
  }

  /**
   * Programmatically move to an item. Used by `v-model` sync and keyboard.
   */
  function scrollToIndex(index: number, animated = true) {
    if (count() <= 0) return
    cancelAnimation()

    if (isLoop()) {
      // Take the shortest wrapped path from the current position.
      const n = count()
      const current = position.value
      const delta = ((index - wrap(current)) % n + n) % n
      const to = current + (delta > n / 2 ? delta - n : delta)
      if (animated) {
        animateTo(to, baseDuration())
      } else {
        // Non-animated jumps (v-model / mount sync) must not emit `change`,
        // matching the non-loop path below. `activeIndex` wraps `position`.
        position.value = to
      }
      return
    }

    const clamped = clamp(index)
    if (animated) {
      animateTo(clamped, baseDuration())
    } else {
      position.value = clamped
    }
  }

  /** Relative move by whole items (keyboard arrows / page keys). */
  function move(delta: number) {
    if (isBlocked() || count() <= 0) return
    const base = Math.round(position.value)
    scrollToIndex(isLoop() ? base + delta : clamp(base + delta), true)
  }

  function onWheel(event: WheelEvent) {
    if (isBlocked() || count() <= 0) return
    event.preventDefault()
    cancelAnimation()
    beginScroll()

    // Normalize wheel deltas to pixels: Firefox reports line (deltaMode 1) or
    // page (deltaMode 2) units, which would otherwise be far too small.
    const axisSize = Math.max(1, toValue(options.visibleItems)) * itemSize()
    const toPixels = (delta: number) => event.deltaMode === 1
      ? delta * WHEEL_LINE_HEIGHT
      : event.deltaMode === 2
        ? delta * axisSize
        : delta

    const deltaX = toPixels(event.deltaX)
    const deltaY = toPixels(event.deltaY)
    const primary = isHorizontal()
      ? (Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY)
      : deltaY
    const direction = isHorizontal() && toValue(options.rtl) ? -1 : 1

    position.value = resist(position.value + (primary * direction * sensitivity()) / itemSize())

    if (wheelTimer) clearTimeout(wheelTimer)
    wheelTimer = setTimeout(() => {
      wheelTimer = null
      if (snapEnabled()) {
        snapToNearest()
      } else {
        settle(position.value)
      }
    }, WHEEL_SNAP_DELAY)
  }

  function readCoord(event: PointerEvent): number {
    return isHorizontal() ? event.clientX : event.clientY
  }

  function onPointerDown(event: PointerEvent) {
    if (isBlocked() || count() <= 0 || event.button !== 0) return

    // Cancel a pending wheel snap so it can't fire mid-drag.
    if (wheelTimer) {
      clearTimeout(wheelTimer)
      wheelTimer = null
    }
    cancelAnimation()
    dragging = true
    pointerId = event.pointerId
    target = event.currentTarget
    startCoord = readCoord(event)
    startPosition = position.value
    lastPosition = position.value
    lastTime = performance.now()
    velocity = 0

    const el = event.currentTarget as HTMLElement | null
    el?.setPointerCapture?.(event.pointerId)
    // `preventDefault` stops text selection during the drag but also suppresses
    // the native focus, so focus the wheel explicitly to keep it keyboard-driven.
    el?.focus?.()
    beginScroll()
    event.preventDefault()
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging || event.pointerId !== pointerId) return

    const delta = readCoord(event) - startCoord
    const direction = isHorizontal() && toValue(options.rtl) ? 1 : -1
    const next = startPosition + (delta * direction * sensitivity()) / itemSize()
    position.value = resist(next)

    const now = performance.now()
    const dt = now - lastTime
    if (dt > 0) {
      // Smooth the velocity a little to avoid jitter on the last sample.
      velocity = 0.8 * ((position.value - lastPosition) / dt) + 0.2 * velocity
      lastPosition = position.value
      lastTime = now
    }
  }

  function onPointerUp(event: PointerEvent) {
    if (!dragging || event.pointerId !== pointerId) return
    dragging = false
    pointerId = null

    if (target && (target as HTMLElement).releasePointerCapture) {
      try {
        (target as HTMLElement).releasePointerCapture(event.pointerId)
      } catch {
        // Pointer may already be released.
      }
    }
    target = null

    const projected = momentumEnabled()
      ? position.value + velocity * MOMENTUM_AMPLITUDE
      : position.value

    const to = snapEnabled() ? Math.round(projected) : projected
    const distance = Math.abs(to - position.value)
    const base = baseDuration()
    const duration = Math.min(base + distance * 80, base * 5)

    animateTo(isLoop() ? to : clamp(to), duration)
  }

  function onKeydown(event: KeyboardEvent) {
    if (isBlocked() || count() <= 0) return

    const visible = Math.max(1, Math.trunc(toValue(options.visibleItems)))
    const horizontal = isHorizontal()
    const rtl = toValue(options.rtl)

    switch (event.key) {
      case 'ArrowDown':
        if (horizontal) return
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        if (horizontal) return
        event.preventDefault()
        move(-1)
        break
      case 'ArrowRight':
        if (!horizontal) return
        event.preventDefault()
        move(rtl ? -1 : 1)
        break
      case 'ArrowLeft':
        if (!horizontal) return
        event.preventDefault()
        move(rtl ? 1 : -1)
        break
      case 'PageDown':
        event.preventDefault()
        move(visible)
        break
      case 'PageUp':
        event.preventDefault()
        move(-visible)
        break
      case 'Home':
        event.preventDefault()
        scrollToIndex(0, true)
        break
      case 'End':
        event.preventDefault()
        scrollToIndex(count() - 1, true)
        break
    }
  }

  /**
   * Inline style for a rendered cell. Projects the flat list onto a virtual
   * cylinder using a translate + scale (no CSS `perspective`, so there is no
   * depth magnification that could overflow/clip the viewport): the centered
   * item is full size while neighbours bunch together and flatten toward the
   * edges, reproducing the wheel curvature. `virtualIndex` may lie outside
   * `[0, count)` in loop mode; the caller maps it back to a real item.
   */
  function itemStyle(virtualIndex: number): CSSProperties {
    const size = itemSize()
    const visible = Math.max(1, toValue(options.visibleItems))
    const half = (visible - 1) / 2
    const unit = Math.min(90 / (half + 1), MAX_UNIT_ANGLE)
    const distance = virtualIndex - position.value
    const angle = distance * unit
    const hidden = Math.abs(angle) >= 90

    const rad = (angle * Math.PI) / 180
    const unitRad = (unit * Math.PI) / 180
    // Cylinder radius chosen so adjacent items are spaced by ~`size` at the center.
    const radius = size / unitRad
    const offset = radius * Math.sin(rad)
    const scale = Math.max(0, Math.cos(rad))
    const opacity = hidden ? 0 : Math.max(0.2, scale)
    const visibility = hidden ? 'hidden' as const : undefined

    const horizontal = isHorizontal()
    const direction = horizontal && toValue(options.rtl) ? -1 : 1
    const translate = offset * direction

    if (horizontal) {
      // Size to content (not clamped to `size`) so labels are never truncated;
      // `translateX(-50%)` keeps each item centered on its position along the axis.
      return {
        position: 'absolute',
        insetBlock: 0,
        insetInlineStart: '50%',
        transform: `translateX(calc(-50% + ${translate}px)) scaleX(${scale})`,
        opacity,
        visibility
      }
    }

    return {
      position: 'absolute',
      insetInline: 0,
      top: '50%',
      height: `${size}px`,
      marginTop: `-${size / 2}px`,
      transform: `translateY(${translate}px) scaleY(${scale})`,
      opacity,
      visibility
    }
  }

  onScopeDispose(() => {
    cancelAnimation()
    if (wheelTimer) clearTimeout(wheelTimer)
  })

  return {
    /** Continuous position in item units (item N centered when `position === N`). */
    position,
    /** Resolved, wrapped/clamped index of the centered item. */
    activeIndex,
    /** Whether a scroll/drag/animation is currently in flight. */
    isScrolling,
    scrollToIndex,
    move,
    itemStyle,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeydown
  }
}

export type WheelPickerEngine = ReturnType<typeof useWheelPicker>
