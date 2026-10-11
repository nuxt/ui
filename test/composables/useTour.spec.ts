import { describe, it, expect, afterEach, vi } from 'vitest'
import { ref, nextTick, effectScope } from 'vue'
import type { EffectScope } from 'vue'
import { useTour } from '../../src/runtime/composables/useTour'

describe('useTour', () => {
  let scope: EffectScope | undefined

  // Runs the composable in a disposable scope so its listeners do not leak between tests.
  function withScope<T>(fn: () => T): T {
    scope = effectScope()
    return scope.run(fn)!
  }

  function mockBox(el: Element, box: { top: number, left: number, width: number, height: number }) {
    const spy = vi.fn(() => ({ ...box, x: box.left, y: box.top, right: box.left + box.width, bottom: box.top + box.height, toJSON: () => ({}) }) as DOMRect)
    el.getBoundingClientRect = spy
    return spy
  }

  afterEach(() => {
    scope?.stop()
    scope = undefined
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  describe('state & navigation', () => {
    it('starts closed with sensible defaults', () => {
      const tour = useTour([{ title: 'a' }, { title: 'b' }, { title: 'c' }])

      expect(tour.open.value).toBe(false)
      expect(tour.index.value).toBe(0)
      expect(tour.total.value).toBe(3)
      expect(tour.hasPrev.value).toBe(false)
      expect(tour.hasNext.value).toBe(true)
      expect(tour.current.value).toEqual({ title: 'a' })
    })

    it('opens with start() and walks forward/back', () => {
      const tour = useTour([{ title: 'a' }, { title: 'b' }, { title: 'c' }])

      tour.start()
      expect(tour.open.value).toBe(true)
      expect(tour.index.value).toBe(0)

      tour.next()
      expect(tour.index.value).toBe(1)
      expect(tour.hasPrev.value).toBe(true)
      expect(tour.hasNext.value).toBe(true)

      tour.next()
      expect(tour.index.value).toBe(2)
      expect(tour.hasNext.value).toBe(false)

      tour.prev()
      expect(tour.index.value).toBe(1)
    })

    it('finishes (closes) when calling next() on the last step without loop', () => {
      const tour = useTour([{ title: 'a' }, { title: 'b' }])

      tour.start(1)
      expect(tour.open.value).toBe(true)

      tour.next()
      expect(tour.open.value).toBe(false)
    })

    it('loops back to the first step when loop is enabled', () => {
      const tour = useTour([{ title: 'a' }, { title: 'b' }], { loop: true })

      tour.start(1)
      tour.next()
      expect(tour.index.value).toBe(0)
      expect(tour.open.value).toBe(true)
    })

    it('clamps goTo() to the steps range and opens', () => {
      const tour = useTour([{ title: 'a' }, { title: 'b' }, { title: 'c' }])

      tour.goTo(99)
      expect(tour.index.value).toBe(2)
      expect(tour.open.value).toBe(true)

      tour.goTo(-5)
      expect(tour.index.value).toBe(0)
    })

    it('respects initialStep', () => {
      const tour = useTour([{ title: 'a' }, { title: 'b' }], { initialStep: 1 })

      expect(tour.index.value).toBe(1)
      tour.start()
      expect(tour.index.value).toBe(1)
    })

    it('closes automatically when the steps become empty', async () => {
      const steps = ref([{ title: 'a' }])
      const tour = useTour(steps)

      tour.start()
      expect(tour.open.value).toBe(true)

      steps.value = []
      await nextTick()

      expect(tour.open.value).toBe(false)
      expect(tour.total.value).toBe(0)
    })

    it('does not open when there are no steps', () => {
      const tour = useTour([])

      tour.start()
      expect(tour.open.value).toBe(false)
      expect(tour.total.value).toBe(0)

      tour.goTo(2)
      expect(tour.open.value).toBe(false)
    })

    it('passes arbitrary step fields through via current', () => {
      const tour = useTour([{ target: null, title: 'x', side: 'right', body: 'hello' }])
      tour.start()

      expect(tour.current.value?.side).toBe('right')
      expect(tour.current.value?.body).toBe('hello')
    })
  })

  describe('reference resolution', () => {
    it('is undefined while the tour is closed', () => {
      const el = document.createElement('div')
      const tour = useTour([{ target: el }])

      expect(tour.reference.value).toBeUndefined()
    })

    it('resolves a direct element target', () => {
      const el = document.createElement('div')
      const tour = useTour([{ target: el }])
      tour.start()

      expect(tour.reference.value).toBe(el)
    })

    it('resolves a getter target', () => {
      const el = document.createElement('div')
      const tour = useTour([{ target: () => el }])
      tour.start()

      expect(tour.reference.value).toBe(el)
    })

    it('resolves a string selector target', () => {
      const el = document.createElement('div')
      el.id = 'tour-step'
      document.body.appendChild(el)

      const tour = useTour([{ target: '#tour-step' }])
      tour.start()

      expect(tour.reference.value).toBe(el)
    })

    it('resolves a bare id as #id', () => {
      const el = document.createElement('div')
      el.id = 'bare-id'
      document.body.appendChild(el)

      const tour = useTour([{ target: 'bare-id' }])
      tour.start()

      expect(tour.reference.value).toBe(el)
    })

    it('resolves any CSS selector target', () => {
      const el = document.createElement('button')
      el.setAttribute('data-tour', 'step')
      document.body.appendChild(el)

      const tour = useTour([{ target: 'button[data-tour="step"]' }])
      tour.start()

      expect(tour.reference.value).toBe(el)
    })

    it('prefers a bare id over a matching tag name', () => {
      const tag = document.createElement('header')
      const el = document.createElement('div')
      el.id = 'header'
      document.body.append(tag, el)

      const tour = useTour([{ target: 'header' }])
      tour.start()

      expect(tour.reference.value).toBe(el)
    })

    it('does not fall back to a tag when a plain word matches no id', () => {
      const tag = document.createElement('header')
      document.body.appendChild(tag)

      const tour = useTour([{ target: 'header' }])
      tour.start()

      expect(tour.reference.value).toBeUndefined()
    })

    it('does not treat an explicit selector as a literal id', () => {
      const literal = document.createElement('div')
      literal.id = '#cta'
      const el = document.createElement('div')
      el.id = 'cta'
      document.body.append(literal, el)

      const tour = useTour([{ target: '#cta' }])
      tour.start()

      expect(tour.reference.value).toBe(el)
    })

    it('is undefined for a non-matching selector', () => {
      const tour = useTour([{ target: '#no-such-id' }])
      tour.start()

      expect(tour.reference.value).toBeUndefined()
    })

    it('does not throw on a malformed selector and resolves to undefined', () => {
      const tour = useTour([{ target: '#a b]' }])
      tour.start()

      expect(() => tour.reference.value).not.toThrow()
      expect(tour.reference.value).toBeUndefined()
    })

    it('falls back to a centered virtual element when target is null', () => {
      const tour = useTour([{ target: null }])
      tour.start()

      expect(typeof tour.reference.value?.getBoundingClientRect).toBe('function')
      expect(tour.reference.value).not.toBeInstanceOf(Element)
    })
  })

  describe('rect', () => {
    it('sets up without DOM globals, as during SSR', () => {
      vi.stubGlobal('Element', undefined)

      expect(() => withScope(() => useTour([{ target: '#cta' }]))).not.toThrow()
    })

    it('is null while the tour is closed', async () => {
      const el = document.createElement('div')
      mockBox(el, { top: 10, left: 20, width: 100, height: 40 })
      const tour = withScope(() => useTour([{ target: el }]))
      await nextTick()

      expect(tour.rect.value).toBeNull()
    })

    it('matches the target box once the tour opens', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      mockBox(el, { top: 10, left: 20, width: 100, height: 40 })
      const tour = withScope(() => useTour([{ target: el }]))

      tour.start()
      await nextTick()

      expect(tour.rect.value).toEqual({ top: 10, left: 20, width: 100, height: 40 })
    })

    it('follows the active step', async () => {
      const a = document.createElement('div')
      const b = document.createElement('div')
      document.body.append(a, b)
      mockBox(a, { top: 0, left: 0, width: 10, height: 10 })
      mockBox(b, { top: 300, left: 50, width: 200, height: 80 })
      const tour = withScope(() => useTour([{ target: a }, { target: b }]))

      tour.start()
      await nextTick()
      tour.next()
      await nextTick()

      expect(tour.rect.value).toEqual({ top: 300, left: 50, width: 200, height: 80 })
    })

    it('uses the box of a virtual element target', async () => {
      const virtual = { getBoundingClientRect: () => ({ top: 5, left: 6, width: 0, height: 0, x: 6, y: 5, right: 6, bottom: 5, toJSON: () => ({}) }) as DOMRect }
      const tour = withScope(() => useTour([{ target: virtual }]))

      tour.start()
      await nextTick()

      expect(tour.rect.value).toEqual({ top: 5, left: 6, width: 0, height: 0 })
    })

    it('is null for a centered step', async () => {
      const tour = withScope(() => useTour([{ target: null }]))

      tour.start()
      await nextTick()

      expect(tour.rect.value).toBeNull()
    })

    it('is null once a resolved target is removed from the DOM', async () => {
      const el = document.createElement('div')
      el.id = 'removed-target'
      document.body.appendChild(el)
      mockBox(el, { top: 10, left: 20, width: 100, height: 40 })
      const tour = withScope(() => useTour([{ target: '#removed-target' }], { scrollIntoView: false }))

      tour.start()
      await nextTick()
      el.remove()
      window.dispatchEvent(new Event('resize'))

      expect(tour.rect.value).toBeNull()
    })

    it('is null when the target cannot be resolved', async () => {
      const tour = withScope(() => useTour([{ target: '#no-such-id' }]))

      tour.start()
      await nextTick()

      expect(tour.rect.value).toBeNull()
    })

    it('updates when any scroll container scrolls', async () => {
      const container = document.createElement('div')
      const el = document.createElement('div')
      container.appendChild(el)
      document.body.appendChild(container)
      mockBox(el, { top: 100, left: 20, width: 50, height: 50 })
      const tour = withScope(() => useTour([{ target: el }], { scrollIntoView: false }))

      tour.start()
      await nextTick()
      mockBox(el, { top: 40, left: 20, width: 50, height: 50 })
      // Scroll events do not bubble, so this only reaches a capture listener on window.
      container.dispatchEvent(new Event('scroll'))

      expect(tour.rect.value).toEqual({ top: 40, left: 20, width: 50, height: 50 })
    })

    it('updates when the window is resized', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      mockBox(el, { top: 100, left: 20, width: 50, height: 50 })
      const tour = withScope(() => useTour([{ target: el }], { scrollIntoView: false }))

      tour.start()
      await nextTick()
      mockBox(el, { top: 100, left: 300, width: 50, height: 50 })
      window.dispatchEvent(new Event('resize'))

      expect(tour.rect.value).toEqual({ top: 100, left: 300, width: 50, height: 50 })
    })

    it('updates when the target is resized', async () => {
      const observers: { callback: ResizeObserverCallback, targets: Element[] }[] = []
      vi.stubGlobal('ResizeObserver', class {
        targets: Element[] = []
        constructor(public callback: ResizeObserverCallback) {
          observers.push(this)
        }

        observe(target: Element) {
          this.targets.push(target)
        }

        unobserve() {}
        disconnect() {}
      })

      const el = document.createElement('div')
      document.body.appendChild(el)
      mockBox(el, { top: 10, left: 10, width: 50, height: 50 })
      const tour = withScope(() => useTour([{ target: el }], { scrollIntoView: false }))

      tour.start()
      await nextTick()
      const observer = observers.find(o => o.targets.includes(el))
      expect(observer).toBeDefined()

      mockBox(el, { top: 10, left: 10, width: 120, height: 90 })
      observer!.callback([], observer as unknown as ResizeObserver)

      expect(tour.rect.value).toEqual({ top: 10, left: 10, width: 120, height: 90 })
    })

    it('resets once the tour finishes', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      mockBox(el, { top: 10, left: 20, width: 100, height: 40 })
      const tour = withScope(() => useTour([{ target: el }], { scrollIntoView: false }))

      tour.start()
      await nextTick()
      tour.finish()
      await nextTick()

      expect(tour.rect.value).toBeNull()
    })

    it('only listens to the window while the tour is open', async () => {
      const add = vi.spyOn(window, 'addEventListener')
      const remove = vi.spyOn(window, 'removeEventListener')
      const events = (spy: typeof add) => spy.mock.calls.map(([type]) => String(type)).filter(type => type === 'scroll' || type === 'resize')

      const el = document.createElement('div')
      document.body.appendChild(el)
      const tour = withScope(() => useTour([{ target: el }], { scrollIntoView: false }))
      await nextTick()
      expect(events(add)).toEqual([])

      tour.start()
      await nextTick()
      expect(events(add).sort()).toEqual(['resize', 'scroll'])

      tour.finish()
      await nextTick()
      expect(events(remove).sort()).toEqual(['resize', 'scroll'])

      add.mockRestore()
      remove.mockRestore()
    })
  })
})
