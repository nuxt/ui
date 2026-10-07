import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useKbd } from '../../src/runtime/composables/useKbd'

const originalUserAgent = navigator.userAgent

function setUserAgent(ua: string) {
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true })
}

describe('useKbd', () => {
  // `getKbdKey` only resolves meta/ctrl/alt once the calling component has mounted.
  describe('platform-specific keys (meta/ctrl/alt)', () => {
    let wrapper: Awaited<ReturnType<typeof mountSuspended>>

    afterEach(() => {
      wrapper?.unmount()
      setUserAgent(originalUserAgent)
    })

    async function mountKbd() {
      let api!: ReturnType<typeof useKbd>
      const component = defineComponent({
        setup() {
          api = useKbd()
          return () => null
        }
      })
      wrapper = await mountSuspended(component)
      return api
    }

    it('maps meta/ctrl/alt to macOS symbols on macOS', async () => {
      setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      const kbd = await mountKbd()

      expect(kbd.macOS.value).toBeTruthy()
      expect(kbd.getKbdKey('meta')).toBe('⌘')
      expect(kbd.getKbdKey('ctrl')).toBe('⌃')
      expect(kbd.getKbdKey('alt')).toBe('⌥')
    })

    it('maps meta/ctrl/alt to text labels off macOS', async () => {
      setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      const kbd = await mountKbd()

      expect(kbd.macOS.value).toBeFalsy()
      expect(kbd.getKbdKey('meta')).toBe('Ctrl')
      expect(kbd.getKbdKey('ctrl')).toBe('Ctrl')
      expect(kbd.getKbdKey('alt')).toBe('Alt')
    })

    it('keeps meta/ctrl/alt as a placeholder until the calling component has mounted', async () => {
      setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      await mountKbd()

      let beforeMount: string | undefined
      let api!: ReturnType<typeof useKbd>
      const second = await mountSuspended(defineComponent({
        setup() {
          api = useKbd()
          beforeMount = api.getKbdKey('meta')
          return () => null
        }
      }))

      expect(beforeMount).toBe(' ')
      expect(api.getKbdKey('meta')).toBe('Ctrl')
      second.unmount()
    })
  })

  describe('static key resolution', () => {
    it('maps named keys to their symbols', () => {
      const { getKbdKey } = useKbd()

      expect(getKbdKey('enter')).toBe('↵')
      expect(getKbdKey('shift')).toBe('⇧')
      expect(getKbdKey('escape')).toBe('Esc')
      expect(getKbdKey('tab')).toBe('⇥')
      expect(getKbdKey('backspace')).toBe('⌫')
      expect(getKbdKey('delete')).toBe('⌦')
      expect(getKbdKey('capslock')).toBe('⇪')
      expect(getKbdKey('command')).toBe('⌘')
    })

    it('maps arrow keys to their symbols', () => {
      const { getKbdKey } = useKbd()

      expect(getKbdKey('arrowup')).toBe('↑')
      expect(getKbdKey('arrowright')).toBe('→')
      expect(getKbdKey('arrowdown')).toBe('↓')
      expect(getKbdKey('arrowleft')).toBe('←')
    })

    it('returns the raw value for keys that are not in the map', () => {
      const { getKbdKey } = useKbd()

      expect(getKbdKey('a')).toBe('a')
      expect(getKbdKey('f1')).toBe('f1')
      expect(getKbdKey('/')).toBe('/')
    })

    it('returns undefined for a missing value', () => {
      const { getKbdKey } = useKbd()

      expect(getKbdKey()).toBeUndefined()
      expect(getKbdKey('')).toBeUndefined()
    })
  })
})
