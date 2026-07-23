import { describe, test, expect, vi } from 'vitest'
import ui from '../../src/vite'
import UnheadPlugin from '../../src/plugins/unhead'

function getResolveId() {
  const resolveId = UnheadPlugin().vite?.resolveId

  if (typeof resolveId !== 'function') {
    throw new TypeError('Expected a Vite resolveId hook')
  }

  return resolveId
}

describe('UnheadPlugin', () => {
  test('runs before the virtual Vue plugin', () => {
    const result = ui({ dts: false })
    const plugins = Array.isArray(result) ? result : [result]
    const unheadIndex = plugins.findIndex(plugin => plugin.name === 'nuxt:ui:unhead')
    const vuePluginIndex = plugins.findIndex(plugin => plugin.name === 'nuxt:ui:plugins')

    expect(unheadIndex).toBeGreaterThanOrEqual(0)
    expect(unheadIndex).toBeLessThan(vuePluginIndex)
  })

  test('reports a missing Unhead peer from the Vue project', async () => {
    const resolve = vi.fn().mockResolvedValue(null)
    const error = vi.fn((message: string) => {
      throw new Error(message)
    })

    await expect(getResolveId().call(
      { resolve, error } as never,
      '@nuxt/ui/vue-plugin',
      '/project/src/main.ts'
    )).rejects.toThrow('[Nuxt UI] Could not resolve `@unhead/vue`, which is required when using Nuxt UI with Vue. Install it with `pnpm add @unhead/vue` and restart Vite.')
    expect(resolve).toHaveBeenCalledWith('@unhead/vue', '/project/src/main.ts', { skipSelf: true })
  })

  test('allows a resolvable Unhead peer', async () => {
    const resolve = vi.fn().mockResolvedValue({ id: '/project/node_modules/@unhead/vue/dist/index.mjs' })

    await expect(getResolveId().call(
      { resolve } as never,
      '@nuxt/ui/vue-plugin',
      '/project/src/main.ts'
    )).resolves.toBeUndefined()
  })

  test('ignores imports outside the Vue plugin', async () => {
    const resolve = vi.fn()

    await expect(getResolveId().call(
      { resolve } as never,
      '@nuxt/ui/components/Button.vue',
      '/project/src/main.ts'
    )).resolves.toBeUndefined()
    expect(resolve).not.toHaveBeenCalled()
  })
})
