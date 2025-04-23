import { createHead } from '@unhead/vue/client'
import type { Plugin } from 'vue'

export default {
  install(app) {
    // check for existing head instance to avoid replacement
    // bit hacky but we can't use injectHead() here
    if (app._context.provides.usehead) {
      return
    }
    const head = createHead()
    app.use(head)
  }
} satisfies Plugin
