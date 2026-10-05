import { defineConfig } from '@nuxtjs/mdc/config'
import { shikiTransformers } from './utils/shiki'

export default defineConfig({
  shiki: {
    transformers: shikiTransformers()
  }
})
