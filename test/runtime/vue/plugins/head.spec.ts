import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { injectHead } from '@unhead/vue'
import { describe, it, expect } from 'vitest'
import ui from '@nuxt/ui/vue-plugin'

describe('Vue plugin head integration', () => {
  it('installs Unhead and renders Nuxt UI colors', async () => {
    const app = createApp({})

    app.use(ui)

    const head = app.runWithContext(() => injectHead())
    expect(head).toBeDefined()

    await expect.poll(() => document.querySelector<HTMLStyleElement>('style#nuxt-ui-colors')?.textContent)
      .toContain('--ui-primary')
  })

  it('preserves an existing Unhead instance', () => {
    const app = createApp({})
    const head = createHead()

    app.use(head)
    app.use(ui)

    expect(app.runWithContext(() => injectHead())).toBe(head)
  })
})
