import { useDark } from '@vueuse/core'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  useDark()
})
