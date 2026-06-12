import { describe, it, expect, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useTour } from '../../src/runtime/composables/useTour'

describe('useTour', () => {
  afterEach(() => {
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
})
