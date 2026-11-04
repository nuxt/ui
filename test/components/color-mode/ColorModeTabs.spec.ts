import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { useColorMode } from '#imports'
import ColorModeTabs from '../../../src/runtime/components/color-mode/ColorModeTabs.vue'

describe('ColorModeTabs', () => {
  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ColorModeTabs)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('hides the labels visually unless the `ui` prop shows them', async () => {
    const hidden = await mountSuspended(ColorModeTabs)
    expect(hidden.find('[data-slot="tabs-label"]').classes()).toContain('sr-only')

    const shown = await mountSuspended(ColorModeTabs, { props: { ui: { label: 'not-sr-only' } } })
    expect(shown.find('[data-slot="tabs-label"]').classes()).not.toContain('sr-only')
  })

  it('renders square triggers unless `square` is false', async () => {
    const square = await mountSuspended(ColorModeTabs)
    expect(square.find('[data-slot="tabs-trigger"]').classes()).toContain('px-[calc(var(--ui-control-py)-var(--ui-tabs-track-padding,0px))]')
    expect(square.find('[data-slot="tabs-trigger"]').classes()).not.toContain('px-(--ui-control-px)')

    const padded = await mountSuspended(ColorModeTabs, { props: { square: false } })
    expect(padded.find('[data-slot="tabs-trigger"]').classes()).toContain('px-(--ui-control-px)')
  })

  it('selects the preference after hydrating', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const colorMode = useColorMode()
    const preference = colorMode.preference
    colorMode.preference = 'dark'
    await nextTick()

    const html = await renderToString(createSSRApp(() => h(ColorModeTabs)))
    const container = document.createElement('div')
    container.innerHTML = html
    expect(container.querySelector('[aria-selected="true"]')?.textContent).toBe('System')

    const app = createSSRApp(() => h(ColorModeTabs))
    app.mount(container)
    await nextTick()

    expect(warn.mock.calls.flat().join('\n')).not.toMatch(/Hydration/)
    expect(container.querySelector('[aria-selected="true"]')?.textContent).toBe('Dark')

    app.unmount()
    colorMode.preference = preference
    warn.mockRestore()
  })

  it('sets the preference when a tab is selected', async () => {
    const colorMode = useColorMode()
    const preference = colorMode.preference

    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createSSRApp(() => h(ColorModeTabs))
    app.mount(container)
    await nextTick()

    const light = [...container.querySelectorAll('[role="tab"]')].find(tab => tab.textContent === 'Light') as HTMLElement
    light.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }))
    await nextTick()

    expect(colorMode.preference).toBe('light')

    app.unmount()
    container.remove()
    colorMode.preference = preference
  })
})
