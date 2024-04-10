import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import App from '../../src/runtime/components/App.vue'
import Toast, { type ToastProps } from '../../src/runtime/components/Toast.vue'
import ComponentRender from '../component-render'

const ToastWrapper = defineComponent({
  components: {
    UApp: App,
    UToast: Toast
  },
  inheritAttrs: false,
  template: '<UApp><UToast v-bind="$attrs" /></UApp>'
})

describe('Toast', () => {
  it.each([
    ['basic case', {}],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ToastProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, ToastWrapper)
    expect(html).toMatchSnapshot()
  })
})
