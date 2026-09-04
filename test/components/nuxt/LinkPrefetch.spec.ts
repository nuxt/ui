import { describe, it, expect, vi, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useNuxtApp } from '#imports'
import Link from '../../../src/runtime/components/Link.vue'

// happy-dom ships an inert `IntersectionObserver`, so the callback is driven by hand.
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observed: Element[] = []
  unobserved: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe(el: Element) {
    this.observed.push(el)
  }

  unobserve(el: Element) {
    this.unobserved.push(el)
  }

  disconnect() {
    this.observed = []
  }

  trigger(target: Element) {
    this.callback([{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

// The visibility observer is registered from an idle callback, which falls back
// to a short timeout in happy-dom.
function idle() {
  return new Promise(resolve => setTimeout(resolve, 10))
}

describe('Link prefetch', () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>> | undefined
  let unhook: (() => void) | undefined

  function spyOnPrefetch() {
    const spy = vi.fn()
    unhook = useNuxtApp().hooks.hook('link:prefetch', spy)
    return spy
  }

  afterEach(() => {
    wrapper?.unmount()
    unhook?.()
    vi.unstubAllGlobals()
    MockIntersectionObserver.instances = []
  })

  it('prefetches once on hover or focus with `prefetchOn: interaction`', async () => {
    const spy = spyOnPrefetch()
    wrapper = await mountSuspended(Link, { props: { to: '/about', prefetchOn: 'interaction' }, slots: { default: () => 'About' } })
    const link = wrapper.get('a')

    await link.trigger('pointerenter')
    await flushPromises()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('/about')

    await link.trigger('pointerenter')
    await link.trigger('focus')
    await flushPromises()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('keeps the caller listeners next to the interaction prefetch', async () => {
    const spy = spyOnPrefetch()
    const onPointerenter = vi.fn()
    const onFocus = vi.fn()
    wrapper = await mountSuspended(Link, { props: { to: '/about', prefetchOn: 'interaction' }, attrs: { onPointerenter, onFocus }, slots: { default: () => 'About' } })
    const link = wrapper.get('a')

    await link.trigger('pointerenter')
    await link.trigger('focus')
    await flushPromises()

    expect(onPointerenter).toHaveBeenCalledTimes(1)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('prefetches when the link becomes visible', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const spy = spyOnPrefetch()
    wrapper = await mountSuspended(Link, { props: { to: '/about' }, slots: { default: () => 'About' } })
    const link = wrapper.get('a').element

    await idle()

    const observer = MockIntersectionObserver.instances[0]!
    expect(observer.observed).toEqual([link])
    expect(spy).not.toHaveBeenCalled()

    observer.trigger(link)
    await flushPromises()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('/about')
    expect(observer.unobserved).toEqual([link])
  })

  it('does not observe visibility with `prefetchOn: interaction`', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    wrapper = await mountSuspended(Link, { props: { to: '/about', prefetchOn: 'interaction' }, slots: { default: () => 'About' } })

    await idle()

    expect(MockIntersectionObserver.instances).toHaveLength(0)
  })

  it('does nothing with `noPrefetch`', async () => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    const spy = spyOnPrefetch()
    wrapper = await mountSuspended(Link, { props: { to: '/about', noPrefetch: true }, slots: { default: () => 'About' } })

    await idle()
    await wrapper.get('a').trigger('pointerenter')
    await flushPromises()

    expect(MockIntersectionObserver.instances).toHaveLength(0)
    expect(spy).not.toHaveBeenCalled()
  })
})
