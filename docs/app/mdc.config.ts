import { defineConfig } from '@nuxtjs/mdc/config'
import type { ShikiTransformer } from '@shikijs/types'
import { transformerColorHighlight } from 'shiki-transformer-color-highlight'
import { transformerIconHighlight } from 'shiki-transformer-icon-highlight'

export default defineConfig({
  shiki: {
    transformers: [
      transformerColorHighlight() as ShikiTransformer,
      transformerIconHighlight()
    ]
  }
})
