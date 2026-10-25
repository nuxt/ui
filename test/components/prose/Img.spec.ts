import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createImage } from '@nuxt/image/runtime'
import ipx from '@nuxt/image/runtime/providers/ipx'
import ipxStatic from '@nuxt/image/runtime/providers/ipxStatic'
import none from '@nuxt/image/runtime/providers/none'
import netlifyImageCdn from '@nuxt/image/runtime/providers/netlifyImageCdn'
import Img from '../../../src/runtime/components/prose/Img.vue'

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

describe('ProseImg', () => {
  afterEach(() => {
    image.component = 'img'
    image.useImage = undefined
  })

  it('prepends app.baseURL to the src of a native img', async () => {
    const wrapper = await mountSuspended(Img, {
      props: { src: '/image.png', alt: 'Image', zoom: false }
    })
    expect(wrapper.find('img').attributes('src')).toBe('/base/image.png')
  })

  it.each([
    ['ipx', '/base/_ipx/_/image.png'],
    ['ipxStatic', '/base/_ipx/_/image.png'],
    ['none', '/base/image.png'],
    ['netlifyImageCdn', '/.netlify/images?url=%2Fbase%2Fimage.png']
  ])('applies app.baseURL once with the %s provider', async (provider, src) => {
    useNuxtImage(provider)
    const wrapper = await mountSuspended(Img, {
      props: { src: '/image.png', alt: 'Image', zoom: false }
    })
    expect(wrapper.find('img').attributes('src')).toBe(src)
  })

  it('respects the provider prop', async () => {
    useNuxtImage('ipx')
    const wrapper = await mountSuspended(Img, {
      props: { src: '/image.png', alt: 'Image', zoom: false },
      attrs: { provider: 'none' }
    })
    expect(wrapper.find('img').attributes('src')).toBe('/base/image.png')
  })
})
