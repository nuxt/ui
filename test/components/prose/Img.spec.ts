import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import Img from '../../../src/runtime/components/prose/Img.vue'

const image = vi.hoisted(() => ({ component: 'img' as any }))

vi.mock('#build/ui-image-component', () => ({
  get default() {
    return image.component
  }
}))

mockNuxtImport('useRuntimeConfig', original => () => {
  const config = original()
  return { ...config, app: { ...config.app, baseURL: '/base/' } }
})

const NuxtImg = defineComponent({
  name: 'NuxtImg',
  props: { src: String },
  setup: props => () => h('img', { 'src': props.src, 'data-nuxt-img': '' })
})

describe('ProseImg', () => {
  afterEach(() => {
    image.component = 'img'
  })

  it('prepends app.baseURL to the src of a native img', async () => {
    const wrapper = await mountSuspended(Img, {
      props: { src: '/image.png', alt: 'Image', zoom: false }
    })
    expect(wrapper.find('img').attributes('src')).toBe('/base/image.png')
  })

  it('passes the src as written to NuxtImg', async () => {
    image.component = NuxtImg
    const wrapper = await mountSuspended(Img, {
      props: { src: '/image.png', alt: 'Image', zoom: false }
    })
    expect(wrapper.find('img[data-nuxt-img]').attributes('src')).toBe('/image.png')
  })
})
