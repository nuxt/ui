import { shallowRef, watch } from 'vue'
import type { MaybeComputedElementRef } from '@vueuse/core'
import { createSharedComposable, unrefElement, useEventListener } from '@vueuse/core'

type SpotlightUpdate = (x: number, y: number) => void

const _useSpotlightTracker = () => {
  const updates = new Map<Element, SpotlightUpdate>()
  const near = new Set<Element>()
  let pointer: { x: number, y: number } | undefined
  let frame = 0

  function measure() {
    frame = 0

    // Read every box before any update writes, so one element never forces a layout for the next.
    const rects = Array.from(near, element => [element, element.getBoundingClientRect()] as const)
    for (const [element, rect] of rects) {
      updates.get(element)?.(pointer!.x - rect.left, pointer!.y - rect.top)
    }
  }

  function schedule() {
    if (pointer && near.size && !frame) {
      frame = requestAnimationFrame(measure)
    }
  }

  // Entries land a frame or two late, so elements are picked up a little before they scroll in.
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && updates.has(entry.target)) {
        near.add(entry.target)
      } else {
        near.delete(entry.target)
      }
    }

    schedule()
  }, { rootMargin: '300px', scrollMargin: '300px' })

  useEventListener('pointermove', (event) => {
    // Touch cannot hover: the spotlight would stay wherever the finger last was.
    if (event.pointerType !== 'touch') {
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
  }, { passive: true })
  // Elements also move under a resting pointer.
  useEventListener(['scroll', 'resize'], schedule, { capture: true, passive: true })

  return (element: Element, update: SpotlightUpdate) => {
    updates.set(element, update)
    observer.observe(element)

    return () => {
      updates.delete(element)
      near.delete(element)
      observer.unobserve(element)
    }
  }
}

const useSpotlightTracker = /* @__PURE__ */ createSharedComposable(_useSpotlightTracker)

/**
 * The pointer position relative to `target`. Every caller shares one tracker, which measures once per frame and only elements on or near the screen.
 */
export function useSpotlight(target: MaybeComputedElementRef) {
  const elementX = shallowRef(0)
  const elementY = shallowRef(0)

  if (typeof IntersectionObserver !== 'undefined') {
    const track = useSpotlightTracker()

    watch(() => unrefElement(target), (element, _, onCleanup) => {
      if (element instanceof Element) {
        onCleanup(track(element, (x, y) => {
          elementX.value = x
          elementY.value = y
        }))
      }
    }, { immediate: true, flush: 'post' })
  }

  return { elementX, elementY }
}
