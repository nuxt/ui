import { createHead } from '@unhead/vue/client'
import type { Plugin } from 'vue'

export default {
  install(app) {
    const head = createHead()
    app.use(head)
  }
} satisfies Plugin
