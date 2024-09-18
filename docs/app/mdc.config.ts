import { defineConfig } from '@nuxtjs/mdc/config'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'

export default defineConfig({
  shiki: {
    transformers: [
      transformerColorHighlight()
    ]
  }
})
