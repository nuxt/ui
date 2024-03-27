import { mockNuxtImport } from '@nuxt/test-utils/runtime'

let id = 0

mockNuxtImport('useId', () => {
  return () => {
    return id++
  }
})
