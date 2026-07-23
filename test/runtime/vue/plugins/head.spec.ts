import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { injectHead, useHead } from '@unhead/vue'
import { describe, it, expect } from 'vitest'
import headPlugin from '../../../../src/runtime/vue/plugins/head'

describe('Vue head plugin', () => {
  it('installs a working Unhead instance', async () => {
    const app = createApp({})

    app.use(headPlugin)

    const head = app.runWithContext(() => injectHead())
    expect(head).toBeDefined()

    const entry = app.runWithContext(() => useHead({ title: 'Nuxt UI' }))

    expect(entry).toEqual(expect.objectContaining({
      patch: expect.any(Function),
      dispose: expect.any(Function)
    }))
    await expect.poll(() => document.title).toBe('Nuxt UI')
  })

  it('preserves an existing Unhead instance', () => {
    const app = createApp({})
    const head = createHead()

    app.use(head)
    app.use(headPlugin)

    expect(app.runWithContext(() => injectHead())).toBe(head)
  })
})
