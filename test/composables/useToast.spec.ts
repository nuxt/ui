import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, provide, ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useToast, toastMaxInjectionKey } from '../../src/runtime/composables/useToast'
import type { Toast } from '../../src/runtime/composables/useToast'

describe('useToast', () => {
  let toast: ReturnType<typeof useToast>

  beforeEach(() => {
    toast = useToast()
    toast.clear()
  })

  afterEach(() => {
    toast.clear()
  })

  describe('add', () => {
    it('returns a toast with a generated id and open state', () => {
      const body = toast.add({ title: 'Hello' })

      expect(body.id).toBeDefined()
      expect(body.open).toBe(true)
      expect(body.title).toBe('Hello')
    })

    it('keeps an explicit id', () => {
      const body = toast.add({ id: 'custom', title: 'Hello' })

      expect(body.id).toBe('custom')
    })

    it('pushes the toast to the list after the queue drains', async () => {
      toast.add({ id: 'a', title: 'A' })

      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))
      expect(toast.toasts.value[0]!.id).toBe('a')
    })

    it('increments _duplicate instead of adding a toast with an existing id', async () => {
      toast.add({ id: 'dup', title: 'First' })
      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))

      toast.add({ id: 'dup', title: 'Second' })

      expect(toast.toasts.value).toHaveLength(1)
      expect(toast.toasts.value[0]!.title).toBe('Second')
      expect(toast.toasts.value[0]!._duplicate).toBe(1)
    })

    it('does not duplicate a toast added twice with the same id in the same tick', async () => {
      // Both adds land before the queue drains, so dedup must happen at display time.
      toast.add({ id: 'dup', title: 'First' })
      toast.add({ id: 'dup', title: 'Second' })

      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))
      await new Promise(resolve => setTimeout(resolve, 20))

      expect(toast.toasts.value).toHaveLength(1)
      expect(toast.toasts.value[0]!.title).toBe('Second')
      expect(toast.toasts.value[0]!._duplicate).toBe(1)
    })

    it('does not duplicate a toast added from two useToast instances in the same tick', async () => {
      // Each instance has its own queue, only `toasts` is shared, so the queues can't see each other.
      const other = useToast()

      toast.add({ id: 'cross-dup', title: 'First' })
      other.add({ id: 'cross-dup', title: 'Second' })

      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))
      await new Promise(resolve => setTimeout(resolve, 20))

      expect(toast.toasts.value).toHaveLength(1)
      expect(toast.toasts.value[0]!.title).toBe('Second')
      expect(toast.toasts.value[0]!._duplicate).toBe(1)
    })
  })

  describe('max', () => {
    it('keeps at most 5 toasts by default', async () => {
      for (let i = 0; i < 7; i++) {
        toast.add({ id: `t${i}`, title: `T${i}` })
      }

      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(5))
      // Oldest are dropped, keeping the last 5.
      expect(toast.toasts.value.map((t: Toast) => t.id)).toEqual(['t2', 't3', 't4', 't5', 't6'])
    })

    // `max` is injected, so it must be provided by an ancestor, not the same setup.
    async function mountWithMax(maxValue: number) {
      let scoped!: ReturnType<typeof useToast>
      const Child = defineComponent({
        setup() {
          scoped = useToast()
          return () => null
        }
      })
      const Parent = defineComponent({
        setup() {
          provide(toastMaxInjectionKey, ref(maxValue))
          return () => h(Child)
        }
      })
      const wrapper = await mountSuspended(Parent)
      scoped.clear()
      return { scoped, wrapper }
    }

    it('respects a provided max', async () => {
      const { scoped, wrapper } = await mountWithMax(2)

      for (let i = 0; i < 4; i++) {
        scoped.add({ id: `m${i}`, title: `M${i}` })
      }

      await vi.waitFor(() => expect(scoped.toasts.value).toHaveLength(2))
      expect(scoped.toasts.value.map((t: Toast) => t.id)).toEqual(['m2', 'm3'])

      wrapper.unmount()
    })

    it('displays no toasts when max is 0', async () => {
      const { scoped, wrapper } = await mountWithMax(0)

      scoped.add({ id: 'a' })
      scoped.add({ id: 'b' })

      await new Promise(resolve => setTimeout(resolve, 50))

      expect(scoped.toasts.value).toHaveLength(0)

      wrapper.unmount()
    })
  })

  describe('update', () => {
    it('updates the fields of an existing toast', async () => {
      toast.add({ id: 'u', title: 'Before' })
      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))

      toast.update('u', { title: 'After' })

      expect(toast.toasts.value[0]!.title).toBe('After')
      expect(toast.toasts.value[0]!.open).toBe(true)
    })

    it('does nothing for an unknown id', async () => {
      toast.add({ id: 'u', title: 'Before' })
      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))

      toast.update('missing', { title: 'After' })

      expect(toast.toasts.value[0]!.title).toBe('Before')
    })
  })

  describe('remove', () => {
    it('closes then removes the toast after the exit delay', async () => {
      toast.add({ id: 'r', title: 'Bye' })
      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))

      toast.remove('r')

      // Closed immediately so the exit transition can play...
      expect(toast.toasts.value[0]!.open).toBe(false)
      // ...then dropped from the list once the transition is done.
      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(0))
    })

    it('does not remove a toast that was just updated', async () => {
      toast.add({ id: 'g', title: 'Keep' })
      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))

      // `update` flags the toast as `_updated` for the current tick.
      toast.update('g', { title: 'Updated' })
      toast.remove('g')

      // The remove is ignored while the toast is flagged as updated.
      expect(toast.toasts.value).toHaveLength(1)
      expect(toast.toasts.value[0]!.open).toBe(true)
    })

    it('does nothing for an unknown id', async () => {
      toast.add({ id: 'r', title: 'Bye' })
      await vi.waitFor(() => expect(toast.toasts.value).toHaveLength(1))

      expect(() => toast.remove('missing')).not.toThrow()
      expect(toast.toasts.value).toHaveLength(1)
    })
  })

  describe('clear', () => {
    it('removes all toasts', async () => {
      toast.add({ id: 'a' })
      toast.add({ id: 'b' })
      await vi.waitFor(() => expect(toast.toasts.value.length).toBeGreaterThan(0))

      toast.clear()

      expect(toast.toasts.value).toHaveLength(0)
    })
  })
})
