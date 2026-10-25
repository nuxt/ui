import { describe, expect, it, vi } from 'vitest'
import { h, createSSRApp, defineComponent } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { addIcon, setCustomIconLoader } from '@iconify/vue'
import Icon from '../../src/runtime/vue/components/Icon.vue'
import IconNuxt from '../../src/runtime/components/Icon.vue'

vi.mock('@nuxt/icon/runtime/components/index.js', () => ({
  default: defineComponent({
    name: 'NuxtIcon',
    props: {
      name: { type: String, required: true },
      mode: { type: String, default: null },
      size: { type: [Number, String], default: null },
      customize: { type: [Function, Boolean, null], default: null }
    },
    setup() {
      return () => h('i')
    }
  })
}))

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
    // null loader on a dedicated prefix so the lookup stays offline instead of hitting the Iconify API
    setCustomIconLoader(() => null, 'mock-missing')

    const wrapper = await mountSuspended(Icon, {
      props: { name: 'i-mock-missing:icon', mode: 'svg' }
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

describe('Icon NuxtIcon forwarding', () => {
  it('forwards mode, size and customize when passed', async () => {
    const customize = vi.fn()
    const wrapper = await mountSuspended(IconNuxt, {
      props: { name: 'i-test:icon', mode: 'css', size: 24, customize }
    })

    const nuxtIcon = wrapper.findComponent({ name: 'NuxtIcon' })

    expect(nuxtIcon.props('mode')).toBe('css')
    expect(nuxtIcon.props('size')).toBe(24)
    expect(nuxtIcon.props('customize')).toBe(customize)
  })

  it('does not forward mode, size or customize when not passed', async () => {
    const wrapper = await mountSuspended(IconNuxt, {
      props: { name: 'i-test:icon' }
    })

    const nuxtIcon = wrapper.findComponent({ name: 'NuxtIcon' })

    expect(nuxtIcon.props('mode')).toBeNull()
    expect(nuxtIcon.props('size')).toBeNull()
    // `customize` is Boolean-typed on `UIcon`, so Vue casts it to `false` when absent; it
    // must not be forwarded over NuxtIcon's own default.
    expect(nuxtIcon.props('customize')).toBeNull()
  })

  it('reacts to prop changes', async () => {
    const wrapper = await mountSuspended(IconNuxt, {
      props: { name: 'i-test:icon', mode: 'svg', size: 16 }
    })

    expect(wrapper.findComponent({ name: 'NuxtIcon' }).props('size')).toBe(16)
    expect(wrapper.findComponent({ name: 'NuxtIcon' }).props('mode')).toBe('svg')

    await wrapper.setProps({ mode: 'css', size: 24 })

    expect(wrapper.findComponent({ name: 'NuxtIcon' }).props('mode')).toBe('css')
    expect(wrapper.findComponent({ name: 'NuxtIcon' }).props('size')).toBe(24)
  })

  it('renders the component directly when name is not a string', async () => {
    const CustomIcon = defineComponent({
      name: 'CustomIcon',
      setup() {
        return () => h('svg', { 'data-icon': 'custom' })
      }
    })

    const wrapper = await mountSuspended(IconNuxt, {
      props: { name: CustomIcon }
    })

    expect(wrapper.findComponent({ name: 'NuxtIcon' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'CustomIcon' }).exists()).toBe(true)
  })
})
