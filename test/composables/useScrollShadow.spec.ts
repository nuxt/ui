import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useScrollShadow } from '../../src/runtime/composables/useScrollShadow'

const { arrivedState } = vi.hoisted(() => ({
  arrivedState: {
    top: true,
    bottom: true,
    left: true,
    right: true
  }
}))

vi.mock('@vueuse/core', () => ({
  useScroll: () => ({ arrivedState })
}))

function createMockElement(props: {
  scrollHeight?: number
  clientHeight?: number
  scrollWidth?: number
  clientWidth?: number
} = {}): HTMLElement {
  return {
    scrollHeight: props.scrollHeight ?? 100,
    clientHeight: props.clientHeight ?? 100,
    scrollWidth: props.scrollWidth ?? 100,
    clientWidth: props.clientWidth ?? 100
  } as unknown as HTMLElement
}

describe('useScrollShadow', () => {
  beforeEach(() => {
    arrivedState.top = true
    arrivedState.bottom = true
    arrivedState.left = true
    arrivedState.right = true
  })

  describe('style', () => {
    it('returns undefined when element is null', () => {
      const { style } = useScrollShadow(ref(null))
      expect(style.value).toBeUndefined()
    })

    it('returns undefined when content does not overflow', () => {
      arrivedState.bottom = false
      const el = ref(createMockElement())
      const { style } = useScrollShadow(el)
      expect(style.value).toBeUndefined()
    })

    it('returns undefined when arrived at both ends', () => {
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { style } = useScrollShadow(el)
      expect(style.value).toBeUndefined()
    })

    it('applies end shadow when at start and overflowing', () => {
      arrivedState.bottom = false
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { style } = useScrollShadow(el)

      expect(style.value?.maskImage).toBe('linear-gradient(180deg, #000, #000 calc(100% - 24px), transparent)')
    })

    it('applies start shadow when at end and overflowing', () => {
      arrivedState.top = false
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { style } = useScrollShadow(el)

      expect(style.value?.maskImage).toBe('linear-gradient(180deg, transparent, #000 24px)')
    })

    it('applies both shadows when in the middle', () => {
      arrivedState.top = false
      arrivedState.bottom = false
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { style } = useScrollShadow(el)

      expect(style.value?.maskImage).toBe('linear-gradient(180deg, transparent, #000 24px, #000 calc(100% - 24px), transparent)')
    })

    it('uses custom size', () => {
      arrivedState.bottom = false
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { style } = useScrollShadow(el, { size: 48 })

      expect(style.value?.maskImage).toContain('48px')
    })

    it('uses horizontal angle for horizontal orientation', () => {
      arrivedState.right = false
      const el = ref(createMockElement({ scrollWidth: 300, clientWidth: 100 }))
      const { style } = useScrollShadow(el, { orientation: 'horizontal' })

      expect(style.value?.maskImage).toContain('90deg')
    })

    it('checks horizontal overflow in horizontal mode', () => {
      arrivedState.right = false
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { style } = useScrollShadow(el, { orientation: 'horizontal' })

      expect(style.value).toBeUndefined()
    })
  })

  describe('isOverflowing', () => {
    it('returns false when element is null', () => {
      const { isOverflowing } = useScrollShadow(ref(null))
      expect(isOverflowing.value).toBe(false)
    })

    it('returns false when content fits', () => {
      const el = ref(createMockElement())
      const { isOverflowing } = useScrollShadow(el)
      expect(isOverflowing.value).toBe(false)
    })

    it('returns true when content overflows vertically', () => {
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { isOverflowing } = useScrollShadow(el)
      expect(isOverflowing.value).toBe(true)
    })

    it('returns true when content overflows horizontally', () => {
      const el = ref(createMockElement({ scrollWidth: 300, clientWidth: 100 }))
      const { isOverflowing } = useScrollShadow(el, { orientation: 'horizontal' })
      expect(isOverflowing.value).toBe(true)
    })

    it('ignores vertical overflow in horizontal mode', () => {
      const el = ref(createMockElement({ scrollHeight: 300, clientHeight: 100 }))
      const { isOverflowing } = useScrollShadow(el, { orientation: 'horizontal' })
      expect(isOverflowing.value).toBe(false)
    })
  })

  describe('arrivedState', () => {
    it('exposes arrivedState from useScroll', () => {
      const el = ref(createMockElement())
      const { arrivedState: state } = useScrollShadow(el)
      expect(state).toBe(arrivedState)
    })
  })
})
