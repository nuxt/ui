import { createHead } from '@unhead/vue'
import type { Plugin } from 'vue'

export default {
  install(app) {
    app.use(createHead())
  }
} satisfies Plugin
