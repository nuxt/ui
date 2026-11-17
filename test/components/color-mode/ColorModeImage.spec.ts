import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createImage } from '@nuxt/image/runtime'
import ipx from '@nuxt/image/runtime/providers/ipx'
import ipxStatic from '@nuxt/image/runtime/providers/ipxStatic'
import none from '@nuxt/image/runtime/providers/none'
import netlifyImageCdn from '@nuxt/image/runtime/providers/netlifyImageCdn'
import ColorModeImage from '../../../src/runtime/components/color-mode/ColorModeImage.vue'

const image = vi.hoisted(() => ({ component: 'img' as any, useImage: undefined as any }))

vi.mock('#build/ui-image-component', () => ({
  get default() {
    return image.component
  },
  get useImage() {
    return image.useImage
  }
}))

mockNuxtImport('useRuntimeConfig', original => () => {
  const config = original()
  return { ...config, app: { ...config.app, baseURL: '/base/' } }
})

function useNuxtImage(provider: string) {
  const $img = createImage({
    provider,
    providers: Object.fromEntries(Object.entries({ ipx, ipxStatic, none, netlifyImageCdn }).map(([name, setup]) => [name, { setup, defaults: {} }])),
    presets: {},
    alias: {},
    domains: [],
    nuxt: { baseURL: '/base/' }
  } as any)

  image.component = defineComponent({
    name: 'NuxtImg',
    props: { src: String, provider: String },
    setup: props => () => h('img', { src: $img(props.src!, {}, { provider: props.provider }) })
  })
  image.useImage = () => $img
}

describe('ColorModeImage', () => {
  afterEach(() => {
    image.component = 'img'
    image.useImage = undefined
  })

  it('prepends app.baseURL to the sources of a native img', async () => {
    const wrapper = await mountSuspended(ColorModeImage, {
      props: { light: '/light.png', dark: '/dark.png' }
    })
    expect(wrapper.findAll('img').map(img => img.attributes('src'))).toEqual(['/base/light.png', '/base/dark.png'])
  })

  it.each([
    ['ipx', ['/base/_ipx/_/light.png', '/base/_ipx/_/dark.png']],
    ['ipxStatic', ['/base/_ipx/_/light.png', '/base/_ipx/_/dark.png']],
    ['none', ['/base/light.png', '/base/dark.png']],
    ['netlifyImageCdn', ['/.netlify/images?url=%2Fbase%2Flight.png', '/.netlify/images?url=%2Fbase%2Fdark.png']]
  ])('applies app.baseURL once with the %s provider', async (provider, sources) => {
    useNuxtImage(provider)
    const wrapper = await mountSuspended(ColorModeImage, {
      props: { light: '/light.png', dark: '/dark.png' }
    })
    expect(wrapper.findAll('img').map(img => img.attributes('src'))).toEqual(sources)
  })

  it('respects the provider prop', async () => {
    useNuxtImage('ipx')
    const wrapper = await mountSuspended(ColorModeImage, {
      props: { light: '/light.png', dark: '/dark.png' },
      attrs: { provider: 'none' }
    })
    expect(wrapper.findAll('img').map(img => img.attributes('src'))).toEqual(['/base/light.png', '/base/dark.png'])
  })
})
