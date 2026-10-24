import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import ColorModeImage from '../../../src/runtime/components/color-mode/ColorModeImage.vue'

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

describe('ColorModeImage', () => {
  afterEach(() => {
    image.component = 'img'
  })

  it('prepends app.baseURL to the sources of a native img', async () => {
    const wrapper = await mountSuspended(ColorModeImage, {
      props: { light: '/light.png', dark: '/dark.png' }
    })
    expect(wrapper.findAll('img').map(img => img.attributes('src'))).toEqual(['/base/light.png', '/base/dark.png'])
  })

  it('passes the sources as written to NuxtImg', async () => {
    image.component = NuxtImg
    const wrapper = await mountSuspended(ColorModeImage, {
      props: { light: '/light.png', dark: '/dark.png' }
    })
    expect(wrapper.findAll('img[data-nuxt-img]').map(img => img.attributes('src'))).toEqual(['/light.png', '/dark.png'])
  })
})
