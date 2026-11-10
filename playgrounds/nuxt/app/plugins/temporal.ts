import { install } from 'temporal-polyfill-lite/shim'

export default defineNuxtPlugin({
  name: 'temporal',
  enforce: 'pre',
  setup() {
    install(false)
  }
})
