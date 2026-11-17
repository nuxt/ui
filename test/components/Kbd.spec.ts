import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createSSRApp, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { renderEach } from '../component-render'
import Kbd from '../../src/runtime/components/Kbd.vue'
import theme from '#build/ui/kbd'

describe('Kbd', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  renderEach(Kbd, [
    // Props
    ['with value', { props: { value: 'K' } }],
    ['with platform-specific value', { props: { value: 'meta' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { value: 'K', size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { value: 'K', variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { value: 'K', variant, color: 'neutral' } }]),
    ['with as', { props: { value: 'K', as: 'span' } }],
    ['with class', { props: { value: 'K', class: 'font-bold' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Kbd, {
      props: {
        value: 'K'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('hydrates platform-specific keys without mismatch after another Kbd has mounted', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const mounted = await mountSuspended(Kbd, { props: { value: 'meta' } })

    const html = await renderToString(createSSRApp(() => h(Kbd, { value: 'meta' })))
    const container = document.createElement('div')
    container.innerHTML = html
    expect(Array.from(container.querySelectorAll('kbd > span'), span => span.textContent)).toEqual(['⌘', 'Ctrl'])

    const app = createSSRApp(() => h(Kbd, { value: 'meta' }))
    app.mount(container)
    await nextTick()

    expect(warn.mock.calls.flat().join('\n')).not.toMatch(/Hydration/)
    expect(container.innerHTML).toBe(html)

    app.unmount()
    mounted.unmount()
    warn.mockRestore()
  })
})
