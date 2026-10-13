import { describe, it, expect, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { useColorMode } from '#imports'
import ColorModeButton from '../../../src/runtime/components/color-mode/ColorModeButton.vue'

describe('ColorModeButton', () => {
  it('updates the label after hydrating when the client resolves dark mode', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const colorMode = useColorMode()
    const preference = colorMode.preference
    colorMode.preference = 'dark'
    await nextTick()

    const html = await renderToString(createSSRApp(() => h(ColorModeButton)))
    const container = document.createElement('div')
    container.innerHTML = html
    expect(container.querySelector('button')?.getAttribute('aria-label')).toBe('Switch to dark mode')

    const app = createSSRApp(() => h(ColorModeButton))
    app.mount(container)
    await nextTick()

    expect(warn.mock.calls.flat().join('\n')).not.toMatch(/Hydration/)
    expect(container.querySelector('button')?.getAttribute('aria-label')).toBe('Switch to light mode')

    app.unmount()
    colorMode.preference = preference
    warn.mockRestore()
  })
})
