import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineShortcuts } from '../../src/runtime/composables/defineShortcuts'

describe('defineShortcuts', () => {
  let handlers: Record<string, ReturnType<typeof vi.fn>>

  beforeEach(() => {
    handlers = {
      'f': vi.fn(),
      'h': vi.fn(),
      'f-h': vi.fn(),
      'z-x': vi.fn(),
      'meta_k': vi.fn()
    }
  })

  function createShortcuts(options: any = {}) {
    defineShortcuts(
      {
        'f': handlers.f,
        'h': handlers.h,
        'f-h': handlers['f-h'],
        'z-x': handlers['z-x'],
        'meta_k': handlers['meta_k']
      },
      options
    )
  }

  function dispatchKey(key: string, code?: string) {
    const e = new KeyboardEvent('keydown', {
      key,
      code: code || `Key${key.toUpperCase()}`,
      bubbles: true
    })
    window.dispatchEvent(e)
  }

  it('fires single key shortcuts', async () => {
    createShortcuts({ chainDelay: 50 })

    dispatchKey('f')
    await new Promise(r => setTimeout(r, 60))

    expect(handlers.f).toHaveBeenCalled()
    expect(handlers['f-h']).not.toHaveBeenCalled()
  })

  it('fires chain shortcuts if second key pressed', async () => {
    createShortcuts({ chainDelay: 50 })

    dispatchKey('f')
    dispatchKey('h')
    await new Promise(r => setTimeout(r, 60))

    expect(handlers['f-h']).toHaveBeenCalled()
    expect(handlers.f).not.toHaveBeenCalled()
  })

  it('fires z-x chain independently', async () => {
    createShortcuts({ chainDelay: 50 })

    dispatchKey('z')
    dispatchKey('x')
    await new Promise(r => setTimeout(r, 60))

    expect(handlers['z-x']).toHaveBeenCalled()
  })

  it('fires h alone if pressed independently', async () => {
    createShortcuts({ chainDelay: 50 })

    dispatchKey('h')
    await new Promise(r => setTimeout(r, 60))

    expect(handlers.h).toHaveBeenCalled()
  })

  it('works across different keyboard layouts when layoutIndependent is enabled', async () => {
    createShortcuts({ chainDelay: 50, layoutIndependent: true })

    // Press a different key character on the same physical key
    dispatchKey('ب', 'KeyF') // 'ب' is what Arabic layout produces on the F key
    await new Promise(r => setTimeout(r, 60))

    expect(handlers.f).toHaveBeenCalled()
  })
})
