import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest'
import type { MockInstance } from 'vitest'
import { effectScope } from 'vue'
import type { EffectScope } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { resolveTags } from '@unhead/vue/utils'
import { injectHead, useAppConfig, useNuxtApp } from '#imports'
import { loadColors } from '#build/ui-colors'
import plugin from '../../../src/runtime/plugins/colors'

vi.mock('#build/ui-colors', () => ({
  colors: undefined,
  loadColors: vi.fn(() => import('tailwindcss/colors').then(m => m.default))
}))

describe('colors plugin', () => {
  let nuxtApp: ReturnType<typeof useNuxtApp>
  let appConfig: ReturnType<typeof useAppConfig>
  let head: ReturnType<typeof injectHead>
  let clientStyle: string
  let primary: string

  async function resolveStyle() {
    await flushPromises()
    return resolveTags(head).find(tag => tag.props.id === 'nuxt-ui-colors')?.innerHTML as string
  }

  beforeAll(() => {
    nuxtApp = useNuxtApp()
    appConfig = useAppConfig()
    head = injectHead(nuxtApp)
    clientStyle = resolveTags(head).find(tag => tag.props.id === 'nuxt-ui-colors')!.innerHTML!
    primary = appConfig.ui.colors.primary
  })

  function withBluePrimary(style: string) {
    return style.replace(/(--ui-color-primary-\d+: var\(--color-)[a-z]+-/g, '$1blue-')
  }

  async function hydrate(ssrStyle: string) {
    const style = document.createElement('style')
    style.id = 'nuxt-ui-colors'
    style.textContent = ssrStyle
    document.head.appendChild(style)
    nuxtApp.isHydrating = true
    nuxtApp.payload.serverRendered = true
    await scope.run(() => nuxtApp.runWithContext(() => (plugin as any)(nuxtApp)))
  }

  async function finishHydration() {
    nuxtApp.isHydrating = false
    await nuxtApp.callHook('app:suspense:resolve')
  }

  let push: MockInstance<typeof head.push>
  let scope: EffectScope

  beforeEach(() => {
    scope = effectScope(true)
    vi.mocked(loadColors).mockClear()
    push = vi.spyOn(head, 'push')
  })

  afterEach(() => {
    for (const result of push.mock.results) {
      result.value.dispose()
    }
    push.mockRestore()
    scope.stop()
    document.getElementById('nuxt-ui-colors')?.remove()
    appConfig.ui.colors.primary = primary
    nuxtApp.isHydrating = false
    nuxtApp.payload.serverRendered = false
  })

  it('reuses the server-rendered style without loading the palette', async () => {
    const ssrStyle = clientStyle.replace(/oklch\([^)]*\)/, '#000')
    await hydrate(ssrStyle)
    await finishHydration()

    expect(await resolveStyle()).toBe(ssrStyle)
    expect(loadColors).not.toHaveBeenCalled()
  })

  it('reuses the server-rendered style when the colors are set before hydration ends', async () => {
    const ssrStyle = withBluePrimary(clientStyle)
    await hydrate(ssrStyle)
    appConfig.ui.colors.primary = 'blue'
    await finishHydration()

    expect(await resolveStyle()).toBe(ssrStyle)
    expect(loadColors).not.toHaveBeenCalled()
  })

  it('regenerates the style once the colors change', async () => {
    await hydrate(clientStyle)
    await finishHydration()
    appConfig.ui.colors.primary = 'red'

    const style = await resolveStyle()
    expect(loadColors).toHaveBeenCalledOnce()
    expect(style).toContain('--ui-color-primary-500: var(--color-red-500, oklch(')
  })

  it('retries loading the palette on the next change after a failure', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(loadColors).mockRejectedValueOnce(new Error('chunk failed'))
    await hydrate(clientStyle)
    await finishHydration()

    appConfig.ui.colors.primary = 'red'
    expect(await resolveStyle()).toBe(clientStyle)
    expect(error).toHaveBeenCalled()

    appConfig.ui.colors.primary = 'blue'
    expect(await resolveStyle()).toContain('--ui-color-primary-500: var(--color-blue-500, oklch(')
    expect(loadColors).toHaveBeenCalledTimes(2)
    error.mockRestore()
  })

  it('registers the style without fallbacks when the palette fails to load before rendering', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(loadColors).mockRejectedValueOnce(new Error('chunk failed'))
    nuxtApp.isHydrating = true
    await scope.run(() => nuxtApp.runWithContext(() => (plugin as any)(nuxtApp)))
    document.querySelector('[data-nuxt-ui-colors]')?.remove()

    expect(await resolveStyle()).toContain(`--ui-color-primary-500: var(--color-${primary}-500, );`)
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })

  it('regenerates the style when the server rendered other colors', async () => {
    await hydrate(withBluePrimary(clientStyle))
    await finishHydration()

    expect(await resolveStyle()).toBe(clientStyle)
    expect(loadColors).toHaveBeenCalledOnce()
  })
})
