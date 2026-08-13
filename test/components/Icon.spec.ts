import { describe, expect, it, vi } from 'vitest'
import { h, createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { addIcon, setCustomIconLoader } from '@iconify/vue'
import Icon from '../../src/runtime/vue/components/Icon.vue'

function renderIconToString(name: string) {
  return renderToString(createSSRApp({ render: () => h(Icon, { name, mode: 'svg' }) }))
}

describe('Icon', () => {
  it('outputs the real icon body when server-rendering a preloaded icon', async () => {
    addIcon('mock:server-icon', {
      body: '<path d="M2 2h20v20H2z" />',
      width: 24,
      height: 24
    })

    const html = await renderIconToString('i-mock-server-icon')

    expect(html).toContain('<path')
  })

  it('keeps working on the client for a preloaded icon', async () => {
    addIcon('mock:client-icon', {
      body: '<path d="M2 2h20v20H2z" />',
      width: 24,
      height: 24
    })

    const wrapper = await mountSuspended(Icon, {
      props: { name: 'i-mock-client-icon', mode: 'svg' }
    })

    expect(wrapper.html()).toContain('<path')
  })

  it('falls back to an empty svg on the client when the icon is unknown', async () => {
    const wrapper = await mountSuspended(Icon, {
      props: { name: 'i-mock-missing-icon', mode: 'svg' }
    })

    expect(wrapper.html()).toContain('<svg')
    expect(wrapper.html()).not.toContain('<path')
  })

  it('never asks the loader for an icon that is not preloaded during SSR', async () => {
    // isolated prefix so a load queued by another test's `onMounted` can't bleed into this assertion
    const fetchIcon = vi.fn(() => new Promise<never>(() => {}))
    setCustomIconLoader(fetchIcon, 'mock-ssr-remote')

    await renderIconToString('i-mock-ssr-remote:icon')
    // the loader call is scheduled through `setTimeout`, give it a chance to run before checking
    await new Promise(resolve => setTimeout(resolve))

    expect(fetchIcon).not.toHaveBeenCalled()
  })
})
