import { install } from 'temporal-polyfill-lite/calendars-full/shim'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin({
  name: 'temporal',
  enforce: 'pre',
  setup() {
    install(false)
  }
})
