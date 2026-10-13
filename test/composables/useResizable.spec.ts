import { describe, it, expect, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useResizable } from '../../src/runtime/composables/useResizable'

// A fake pointer event carrying just what the handlers read.
function mouseEvent(clientX = 0): MouseEvent {
  return { clientX, preventDefault() {}, stopPropagation() {} } as unknown as MouseEvent
}

function touchEvent(clientX = 0): TouchEvent {
  return { touches: [{ clientX }], preventDefault() {}, stopPropagation() {} } as unknown as TouchEvent
}

// An element with a known width whose parent has a known width, so the
// percentage math in the drag handlers is deterministic.
function mockEl(width = 100, parentWidth = 200): HTMLElement {
  const parent = document.createElement('div')
  Object.defineProperty(parent, 'offsetWidth', { value: parentWidth, configurable: true })
  const el = document.createElement('div')
  parent.appendChild(el)
  el.getBoundingClientRect = () => ({ width, height: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) })
  return el
}

describe('useResizable', () => {
  afterEach(() => {
    // The corrupted-storage tests write real localStorage/cookies; keep them out of other suites.
    localStorage.clear()
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0]!.trim()
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
      }
    }
  })

  describe('defaults', () => {
    it('exposes sensible defaults', () => {
      const r = useResizable('def', { persistent: false })

      expect(r.size.value).toBe(0)
      expect(r.isDragging.value).toBe(false)
      expect(r.isCollapsed.value).toBe(false)
    })

    it('uses the provided default size', () => {
      const r = useResizable('ds', { persistent: false, defaultSize: 42 })

      expect(r.size.value).toBe(42)
    })
  })

  describe('collapse', () => {
    it('toggles collapse and reports the collapsed size while collapsed', () => {
      const r = useResizable('col', { persistent: false, collapsible: true, defaultSize: 60, collapsedSize: 5 })

      expect(r.isCollapsed.value).toBe(false)
      expect(r.size.value).toBe(60)

      r.collapse()
      expect(r.isCollapsed.value).toBe(true)
      expect(r.size.value).toBe(5)

      // Expanding restores the previous size.
      r.collapse()
      expect(r.isCollapsed.value).toBe(false)
      expect(r.size.value).toBe(60)
    })

    it('accepts an explicit collapsed value', () => {
      const r = useResizable('col-explicit', { persistent: false, collapsible: true, defaultSize: 30, collapsedSize: 0 })

      r.collapse(true)
      expect(r.isCollapsed.value).toBe(true)

      r.collapse(true)
      expect(r.isCollapsed.value).toBe(true)
    })

    it('does nothing when collapsible is false', () => {
      const r = useResizable('no-col', { persistent: false, collapsible: false, defaultSize: 30 })

      r.collapse(true)

      expect(r.isCollapsed.value).toBe(false)
      expect(r.size.value).toBe(30)
    })

    it('syncs with an external collapsed ref both ways', async () => {
      const collapsed = ref(false)
      const r = useResizable('ext', { persistent: false, collapsible: true, defaultSize: 50, collapsedSize: 0 }, { collapsed })

      // Internal -> external
      r.collapse(true)
      await nextTick()
      expect(collapsed.value).toBe(true)
      expect(r.isCollapsed.value).toBe(true)

      // External -> internal
      collapsed.value = false
      await nextTick()
      expect(r.isCollapsed.value).toBe(false)
    })
  })

  describe('onDoubleClick', () => {
    it('expands a collapsed panel and resets to the default size', () => {
      const r = useResizable('dbl', { persistent: false, collapsible: true, defaultSize: 40, collapsedSize: 0 })
      r.el.value = mockEl()

      r.collapse(true)
      expect(r.size.value).toBe(0)

      r.onDoubleClick(mouseEvent())

      expect(r.isCollapsed.value).toBe(false)
      expect(r.size.value).toBe(40)
    })
  })

  describe('mouse drag', () => {
    it('starts dragging, resizes as a percentage, then stops on mouseup', () => {
      const r = useResizable('drag', { persistent: false, unit: '%', side: 'left', minSize: 0, maxSize: 100 })
      r.el.value = mockEl(100, 200)

      r.onMouseDown(mouseEvent(0))
      expect(r.isDragging.value).toBe(true)

      // width 100 + 50px delta = 150px over a 200px parent = 75%.
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 }))
      expect(r.size.value).toBe(75)

      document.dispatchEvent(new MouseEvent('mouseup'))
      expect(r.isDragging.value).toBe(false)
    })

    it('clamps the size to maxSize', () => {
      const r = useResizable('clamp', { persistent: false, unit: '%', side: 'left', minSize: 10, maxSize: 60 })
      r.el.value = mockEl(100, 200)

      r.onMouseDown(mouseEvent(0))
      // 100 + 300 = 400px over 200px = 200%, clamped to 60.
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }))
      expect(r.size.value).toBe(60)

      document.dispatchEvent(new MouseEvent('mouseup'))
    })

    it('ignores drag when not resizable', () => {
      const r = useResizable('not-resizable', { persistent: false, resizable: false })
      r.el.value = mockEl(100, 200)

      r.onMouseDown(mouseEvent(0))

      expect(r.isDragging.value).toBe(false)
    })
  })

  describe('corrupted storage (#6517)', () => {
    it('recovers with defaults when localStorage holds a literal null', () => {
      // A literal `"null"` JSON-parses to `null`, bypassing the storage initial value.
      localStorage.setItem('corrupted-local', 'null')

      const r = useResizable('corrupted-local', { storage: 'local', collapsible: true, defaultSize: 25 })

      expect(r.isCollapsed.value).toBe(false)
      expect(r.size.value).toBe(25)

      r.collapse(true)
      expect(r.isCollapsed.value).toBe(true)
    })

    it('recovers with defaults when the persisted cookie parses to null', () => {
      document.cookie = 'corrupted-cookie=null; path=/'

      const r = useResizable('corrupted-cookie', { collapsible: true, defaultSize: 25 })

      expect(r.isCollapsed.value).toBe(false)
      expect(r.size.value).toBe(25)
    })
  })

  describe('touch drag', () => {
    it('starts dragging on touchstart and stops on touchend', () => {
      const r = useResizable('touch', { persistent: false })
      r.el.value = mockEl(100, 200)

      r.onTouchStart(touchEvent(0))
      expect(r.isDragging.value).toBe(true)

      document.dispatchEvent(new Event('touchend'))
      expect(r.isDragging.value).toBe(false)
    })
  })
})
