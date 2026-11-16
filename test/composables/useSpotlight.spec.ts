import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'
import type { EffectScope } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PageCard from '../../src/runtime/components/PageCard.vue'
import { useSpotlight } from '../../src/runtime/composables/useSpotlight'
import { requestIdleCallback } from '../../src/runtime/utils/prefetch'

// Capturing IntersectionObserver: lets the test drive intersection callbacks synchronously.
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  constructor(public callback: IntersectionObserverCallback, public options?: IntersectionObserverInit) {
    MockIntersectionObserver.instances.push(this)
  }

  observe() {}

  unobserve() {}

  trigger(target: Element, isIntersecting = true) {
    this.callback([{ target, isIntersecting }] as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

describe('useSpotlight', () => {
  const events = ['pointermove', 'scroll', 'resize']

  let frames: FrameRequestCallback[]
  let scopes: EffectScope[]

  beforeEach(() => {
    MockIntersectionObserver.instances = []
    frames = []
    scopes = []
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
  })

  afterEach(() => {
    scopes.forEach(scope => scope.stop())
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  function track(rect = { left: 0, top: 0 }, isIntersecting = true) {
    const element = document.createElement('div')
    const getBoundingClientRect = vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => rect as DOMRect)
    const scope = effectScope()
    const { elementX, elementY } = scope.run(() => useSpotlight(element))!
    scopes.push(scope)
    MockIntersectionObserver.instances.at(-1)?.trigger(element, isIntersecting)

    return { element, scope, rect, getBoundingClientRect, position: () => [elementX.value, elementY.value] }
  }

  function movePointer(clientX: number, clientY: number, pointerType = 'mouse') {
    window.dispatchEvent(new PointerEvent('pointermove', { clientX, clientY, pointerType }))
  }

  function nextFrame() {
    frames.splice(0).forEach(callback => callback(0))
  }

  function listened(spy: { mock: { calls: unknown[][] } }) {
    return spy.mock.calls.map(([type]) => type).filter(type => events.includes(type as string))
  }

  it('follows a mouse or pen pointer, not touch', () => {
    const { position } = track({ left: 100, top: 50 })

    movePointer(110, 70, 'touch')
    expect(frames).toHaveLength(0)

    movePointer(110, 70)
    nextFrame()
    expect(position()).toEqual([10, 20])

    movePointer(130, 90, 'pen')
    nextFrame()
    expect(position()).toEqual([30, 40])
  })

  it('only measures elements on or near the screen, once per frame', () => {
    const near = track()
    const far = track(undefined, false)

    movePointer(10, 20)
    movePointer(11, 21)
    expect(frames).toHaveLength(1)
    nextFrame()

    expect(near.getBoundingClientRect).toHaveBeenCalledOnce()
    expect(near.position()).toEqual([11, 21])
    expect(far.getBoundingClientRect).not.toHaveBeenCalled()
    expect(far.position()).toEqual([0, 0])
  })

  it('measures every element before updating any of them', () => {
    const first = track()
    const second = track()
    second.getBoundingClientRect.mockImplementation(() => {
      expect(first.position()).toEqual([0, 0])
      return second.rect as DOMRect
    })

    movePointer(10, 20)
    nextFrame()

    expect(first.position()).toEqual([10, 20])
    expect(second.position()).toEqual([10, 20])
  })

  it('follows an element that moves under a resting pointer', () => {
    const { rect, position } = track()
    movePointer(110, 70)
    nextFrame()

    // `scroll` does not bubble: a nested scroll container is only seen while capturing.
    rect.top = -30
    document.body.dispatchEvent(new Event('scroll'))
    nextFrame()
    expect(position()).toEqual([110, 100])

    rect.left = 60
    window.dispatchEvent(new Event('resize'))
    nextFrame()
    expect(position()).toEqual([50, 100])
  })

  it('follows an element that appears while the pointer rests', () => {
    track()
    movePointer(110, 70)
    nextFrame()

    const { position } = track({ left: 100, top: 50 })
    nextFrame()
    expect(position()).toEqual([10, 20])
  })

  it('shares one tracker and stops it with the last element', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const first = track()
    const second = track()

    expect(MockIntersectionObserver.instances).toHaveLength(1)
    expect(MockIntersectionObserver.instances[0]!.options).toMatchObject({ rootMargin: '300px', scrollMargin: '300px' })
    expect(listened(addEventListener)).toEqual(events)

    movePointer(10, 20)
    first.scope.stop()
    expect(listened(removeEventListener)).toEqual([])
    nextFrame()
    expect(first.getBoundingClientRect).not.toHaveBeenCalled()
    expect(second.position()).toEqual([10, 20])

    second.scope.stop()
    expect(listened(removeEventListener)).toEqual(events)

    // A new tracker does not know where the pointer is.
    track()
    expect(MockIntersectionObserver.instances).toHaveLength(2)
    expect(frames).toHaveLength(0)
  })

  it('positions the spotlight of a card', async () => {
    const wrapper = await mountSuspended(PageCard, { props: { spotlight: true }, attachTo: document.body })
    await new Promise<void>(resolve => requestIdleCallback(resolve))
    MockIntersectionObserver.instances[0]!.trigger(wrapper.element)

    movePointer(10, 20)
    nextFrame()
    await nextTick()

    expect(wrapper.attributes('style')).toContain('--spotlight-x: 10px')
    expect(wrapper.attributes('style')).toContain('--spotlight-y: 20px')
    wrapper.unmount()
  })

  it('does nothing without `IntersectionObserver`', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const { position } = track()

    movePointer(10, 20)
    expect(listened(addEventListener)).toEqual([])
    expect(position()).toEqual([0, 0])
  })
})
