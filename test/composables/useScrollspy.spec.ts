import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useScrollspy } from '../../src/runtime/composables/useScrollspy'

// Capturing IntersectionObserver: records observed elements and lets the test
// drive intersection callbacks synchronously.
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observed: Element[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe(el: Element) {
    this.observed.push(el)
  }

  unobserve() {}

  disconnect() {
    this.observed = []
  }

  trigger(entries: Array<{ target: Element, isIntersecting: boolean }>) {
    this.callback(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver)
  }
}

function heading(id: string): HTMLElement {
  const el = document.createElement('div')
  el.id = id
  return el
}

describe('useScrollspy', () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>

  beforeEach(() => {
    MockIntersectionObserver.instances = []
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.unstubAllGlobals()
  })

  async function mountSpy() {
    let api!: ReturnType<typeof useScrollspy>
    const component = defineComponent({
      setup() {
        api = useScrollspy()
        return () => null
      }
    })
    wrapper = await mountSuspended(component)
    return { api, observer: MockIntersectionObserver.instances[0]! }
  }

  it('starts with empty visible and active headings', async () => {
    const { api } = await mountSpy()

    expect(api.visibleHeadings.value).toEqual([])
    expect(api.activeHeadings.value).toEqual([])
  })

  it('observes the headings passed to updateHeadings', async () => {
    const { api, observer } = await mountSpy()
    const a = heading('a')
    const b = heading('b')

    api.updateHeadings([a, b])

    expect(observer.observed).toEqual([a, b])
  })

  it('tracks intersecting headings and mirrors them into active headings', async () => {
    const { api, observer } = await mountSpy()
    const a = heading('a')
    const b = heading('b')
    api.updateHeadings([a, b])

    observer.trigger([{ target: a, isIntersecting: true }])
    expect(api.visibleHeadings.value).toEqual(['a'])
    await nextTick()
    expect(api.activeHeadings.value).toEqual(['a'])

    observer.trigger([{ target: b, isIntersecting: true }])
    expect(api.visibleHeadings.value).toEqual(['a', 'b'])
    await nextTick()
    expect(api.activeHeadings.value).toEqual(['a', 'b'])
  })

  it('removes headings once they stop intersecting', async () => {
    const { api, observer } = await mountSpy()
    const a = heading('a')
    api.updateHeadings([a])

    observer.trigger([{ target: a, isIntersecting: true }])
    observer.trigger([{ target: a, isIntersecting: false }])

    expect(api.visibleHeadings.value).toEqual([])
  })

  it('keeps the last active headings when nothing is visible', async () => {
    const { api, observer } = await mountSpy()
    const a = heading('a')
    api.updateHeadings([a])

    observer.trigger([{ target: a, isIntersecting: true }])
    await nextTick()
    expect(api.activeHeadings.value).toEqual(['a'])

    observer.trigger([{ target: a, isIntersecting: false }])
    await nextTick()

    expect(api.visibleHeadings.value).toEqual([])
    // Active headings retain the previous value so the ToC keeps a highlight.
    expect(api.activeHeadings.value).toEqual(['a'])
  })

  it('stops observing previous headings when updating', async () => {
    const { api, observer } = await mountSpy()
    const a = heading('a')
    const b = heading('b')

    api.updateHeadings([a])
    observer.trigger([{ target: a, isIntersecting: true }])
    await nextTick()
    expect(api.activeHeadings.value).toEqual(['a'])

    // e.g. page navigation: old targets are dropped instead of accumulating.
    api.updateHeadings([b])

    expect(observer.observed).toEqual([b])
    expect(api.visibleHeadings.value).toEqual([])
    await nextTick()
    // The last highlight is retained until new intersections arrive.
    expect(api.activeHeadings.value).toEqual(['a'])

    observer.trigger([{ target: b, isIntersecting: true }])
    await nextTick()
    expect(api.activeHeadings.value).toEqual(['b'])
  })

  it('ignores entries whose target has no id', async () => {
    const { api, observer } = await mountSpy()

    observer.trigger([{ target: document.createElement('div'), isIntersecting: true }])

    expect(api.visibleHeadings.value).toEqual([])
  })
})
