import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineShortcuts } from '../../src/runtime/composables/defineShortcuts'
import type { ShortcutsConfig, ShortcutsOptions } from '../../src/runtime/composables/defineShortcuts'

function fireKeydown(key: string, options: Partial<KeyboardEventInit> = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', {
    key,
    code: options.code ?? '',
    bubbles: true,
    cancelable: true,
    ...options
  }))
}

describe('defineShortcuts', () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>

  afterEach(() => {
    wrapper?.unmount()
    // Failure-safe teardown for tests that focus an input, so a thrown assertion can't leak focus.
    document.body.innerHTML = ''
  })

  async function registerShortcuts(config: ShortcutsConfig, options?: ShortcutsOptions) {
    const component = defineComponent({
      setup() {
        defineShortcuts(config, options)
        return () => null
      }
    })
    wrapper = await mountSuspended(component)
  }

  describe('simple key shortcuts', () => {
    it('triggers handler for a letter key', async () => {
      const handler = vi.fn()
      await registerShortcuts({ a: handler })

      fireKeydown('a')
      expect(handler).toHaveBeenCalledOnce()
    })

    it('does not trigger handler for a different key', async () => {
      const handler = vi.fn()
      await registerShortcuts({ a: handler })

      fireKeydown('b')
      expect(handler).not.toHaveBeenCalled()
    })

    it('is case-insensitive for letter keys', async () => {
      const handler = vi.fn()
      await registerShortcuts({ a: handler })

      fireKeydown('a')
      expect(handler).toHaveBeenCalledOnce()
    })

    it('triggers handler for Escape key', async () => {
      const handler = vi.fn()
      await registerShortcuts({ escape: handler })

      fireKeydown('Escape')
      expect(handler).toHaveBeenCalledOnce()
    })

    it('ignores events with empty key (autocomplete)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ a: handler })

      fireKeydown('')
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('shifted special character shortcuts', () => {
    it('triggers ? shortcut when pressing Shift+/', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '?': handler })

      fireKeydown('?', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('triggers ! shortcut when pressing Shift+1', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '!': handler })

      fireKeydown('!', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('triggers @ shortcut when pressing Shift+2', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '@': handler })

      fireKeydown('@', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('triggers # shortcut when pressing Shift+3', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '#': handler })

      fireKeydown('#', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('triggers $ shortcut when pressing Shift+4', async () => {
      const handler = vi.fn()
      await registerShortcuts({ $: handler })

      fireKeydown('$', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('shift modifier with alphabet keys', () => {
    it('shift_a triggers when pressing Shift+A', async () => {
      const handler = vi.fn()
      await registerShortcuts({ shift_a: handler })

      fireKeydown('A', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('a does NOT trigger when pressing Shift+A', async () => {
      const handler = vi.fn()
      await registerShortcuts({ a: handler })

      fireKeydown('A', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('shift_a does NOT trigger without Shift', async () => {
      const handler = vi.fn()
      await registerShortcuts({ shift_a: handler })

      fireKeydown('a')
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('shift modifier with ctrl (issue #5911)', () => {
    it('ctrl_shift_. triggers with Ctrl+Shift+.', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'ctrl_shift_.': handler })

      fireKeydown('.', { ctrlKey: true, shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('ctrl_shift_. does NOT trigger with Ctrl+. (without Shift)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'ctrl_shift_.': handler })

      fireKeydown('.', { ctrlKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('ctrl_. does NOT trigger when Shift is also pressed', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'ctrl_.': handler })

      fireKeydown('.', { ctrlKey: true, shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('ctrl_. triggers without Shift', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'ctrl_.': handler })

      fireKeydown('.', { ctrlKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('ctrl_shift_, does NOT trigger with Ctrl+, (without Shift)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'ctrl_shift_,': handler })

      fireKeydown(',', { ctrlKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('ctrl_shift_, triggers with Ctrl+Shift+,', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'ctrl_shift_,': handler })

      fireKeydown(',', { ctrlKey: true, shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('disambiguates ctrl_. and ctrl_shift_.', async () => {
      const dotHandler = vi.fn()
      const shiftDotHandler = vi.fn()
      await registerShortcuts({
        'ctrl_.': dotHandler,
        'ctrl_shift_.': shiftDotHandler
      })

      fireKeydown('.', { ctrlKey: true })
      expect(dotHandler).toHaveBeenCalledOnce()
      expect(shiftDotHandler).not.toHaveBeenCalled()

      dotHandler.mockClear()

      fireKeydown('.', { ctrlKey: true, shiftKey: true })
      expect(dotHandler).not.toHaveBeenCalled()
      expect(shiftDotHandler).toHaveBeenCalledOnce()
    })
  })

  describe('alt key guard', () => {
    it('alt_k triggers with Alt+K', async () => {
      const handler = vi.fn()
      await registerShortcuts({ alt_k: handler })

      fireKeydown('k', { altKey: true, code: 'KeyK' })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('alt_k triggers when Alt produces a special character (macOS)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ alt_k: handler })

      fireKeydown('˚', { altKey: true, code: 'KeyK' })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('k does NOT trigger when Alt is pressed', async () => {
      const handler = vi.fn()
      await registerShortcuts({ k: handler })

      fireKeydown('˚', { altKey: true, code: 'KeyK' })
      expect(handler).not.toHaveBeenCalled()
    })

    it('alt_k does NOT trigger without Alt', async () => {
      const handler = vi.fn()
      await registerShortcuts({ alt_k: handler })

      fireKeydown('k', { code: 'KeyK' })
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('ctrl modifier', () => {
    it('ctrl_k triggers with Ctrl+K', async () => {
      const handler = vi.fn()
      await registerShortcuts({ ctrl_k: handler })

      fireKeydown('k', { ctrlKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('ctrl_k does NOT trigger without Ctrl', async () => {
      const handler = vi.fn()
      await registerShortcuts({ ctrl_k: handler })

      fireKeydown('k')
      expect(handler).not.toHaveBeenCalled()
    })

    it('k does NOT trigger when Ctrl is pressed', async () => {
      const handler = vi.fn()
      await registerShortcuts({ k: handler })

      fireKeydown('k', { ctrlKey: true })
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('shiftable keys', () => {
    it('shift_tab triggers with Shift+Tab', async () => {
      const handler = vi.fn()
      await registerShortcuts({ shift_tab: handler })

      fireKeydown('Tab', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('tab does NOT trigger with Shift+Tab', async () => {
      const handler = vi.fn()
      await registerShortcuts({ tab: handler })

      fireKeydown('Tab', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('shift_enter triggers with Shift+Enter', async () => {
      const handler = vi.fn()
      await registerShortcuts({ shift_enter: handler })

      fireKeydown('Enter', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })

    it('shift_escape triggers with Shift+Escape', async () => {
      const handler = vi.fn()
      await registerShortcuts({ shift_escape: handler })

      fireKeydown('Escape', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('chained shortcuts', () => {
    it('g-i triggers when pressing g then i', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'g-i': handler })

      fireKeydown('g')
      fireKeydown('i')
      expect(handler).toHaveBeenCalledOnce()
    })

    it('g-i does NOT trigger with only g', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'g-i': handler })

      fireKeydown('g')
      expect(handler).not.toHaveBeenCalled()
    })

    it('g-i does NOT trigger with only i', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'g-i': handler })

      fireKeydown('i')
      expect(handler).not.toHaveBeenCalled()
    })

    it('g-i does NOT trigger in reverse order', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 'g-i': handler })

      fireKeydown('i')
      fireKeydown('g')
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('chained shortcut sharing a prefix with a standalone (#5654)', () => {
    it('fires the chain, not the standalone, when the sequence completes', async () => {
      const f = vi.fn()
      const fh = vi.fn()
      const h = vi.fn()
      await registerShortcuts({ f, 'f-h': fh, h })

      fireKeydown('f')
      fireKeydown('h')

      expect(fh).toHaveBeenCalledOnce()
      expect(f).not.toHaveBeenCalled()
      expect(h).not.toHaveBeenCalled()
    })

    it('fires the standalone alone once the chain delay elapses', async () => {
      const f = vi.fn()
      const fh = vi.fn()
      await registerShortcuts({ f, 'f-h': fh }, { chainDelay: 50 })

      fireKeydown('f')
      // Deferred: the standalone waits in case a chain follows.
      expect(f).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 80))

      expect(f).toHaveBeenCalledOnce()
      expect(fh).not.toHaveBeenCalled()
    })

    it('fires the pending standalone then the next key when the sequence does not complete', async () => {
      const f = vi.fn()
      const fh = vi.fn()
      const x = vi.fn()
      await registerShortcuts({ f, 'f-h': fh, x }, { chainDelay: 50 })

      fireKeydown('f')
      fireKeydown('x')

      expect(f).toHaveBeenCalledOnce()
      expect(x).toHaveBeenCalledOnce()
      expect(f).toHaveBeenCalledBefore(x)
      expect(fh).not.toHaveBeenCalled()
    })

    it('fires the held standalone when the completing chain is disabled', async () => {
      const f = vi.fn()
      const fh = vi.fn()
      // The standalone stays enabled inside inputs, the chain does not.
      await registerShortcuts({ 'f': { handler: f, usingInput: true }, 'f-h': fh }, { chainDelay: 50 })

      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      fireKeydown('f')
      fireKeydown('h')

      expect(f).toHaveBeenCalledOnce()
      expect(fh).not.toHaveBeenCalled()
    })

    it('does not fire a held standalone that got disabled before the delay elapsed', async () => {
      const f = vi.fn()
      await registerShortcuts({ f, 'f-h': vi.fn() }, { chainDelay: 50 })

      fireKeydown('f')

      // Moving focus into an input disables the shortcut while it's still held back.
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      await new Promise(resolve => setTimeout(resolve, 80))

      expect(f).not.toHaveBeenCalled()
    })
  })

  describe('shortcut config object', () => {
    it('supports handler in config object', async () => {
      const handler = vi.fn()
      await registerShortcuts({
        a: { handler }
      })

      fireKeydown('a')
      expect(handler).toHaveBeenCalledOnce()
    })

    it('passes KeyboardEvent to handler', async () => {
      const handler = vi.fn()
      await registerShortcuts({ a: handler })

      fireKeydown('a')
      expect(handler).toHaveBeenCalledWith(expect.any(KeyboardEvent))
    })
  })

  describe('disabled shortcuts', () => {
    it('ignores false config', async () => {
      const handler = vi.fn()
      await registerShortcuts({
        a: handler,
        b: false
      })

      fireKeydown('b')
      expect(handler).not.toHaveBeenCalled()
    })

    it('ignores null config', async () => {
      await registerShortcuts({
        a: null
      })

      fireKeydown('a')
    })

    it('ignores undefined config', async () => {
      await registerShortcuts({
        a: undefined
      })

      fireKeydown('a')
    })
  })

  describe('special key names', () => {
    it('handles dash key as standalone shortcut', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '-': handler })

      fireKeydown('-')
      expect(handler).toHaveBeenCalledOnce()
    })

    it('handles underscore key as standalone shortcut', async () => {
      const handler = vi.fn()
      await registerShortcuts({ _: handler })

      fireKeydown('_', { shiftKey: true })
      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('shift does not false-match when key value changes', () => {
    it('- does NOT trigger when pressing Shift+- (produces _)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '-': handler })

      fireKeydown('_', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('= does NOT trigger when pressing Shift+= (produces +)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '=': handler })

      fireKeydown('+', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it(', does NOT trigger when pressing Shift+, (produces <)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ ',': handler })

      fireKeydown('<', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('. does NOT trigger when pressing Shift+. (produces >)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '.': handler })

      fireKeydown('>', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('/ does NOT trigger when pressing Shift+/ (produces ?)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ '/': handler })

      fireKeydown('?', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })

    it('1 does NOT trigger when pressing Shift+1 (produces !)', async () => {
      const handler = vi.fn()
      await registerShortcuts({ 1: handler })

      fireKeydown('!', { shiftKey: true })
      expect(handler).not.toHaveBeenCalled()
    })
  })
})
