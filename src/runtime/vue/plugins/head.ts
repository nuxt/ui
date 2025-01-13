import { createHead, setHeadInjectionHandler } from '@unhead/vue'
import type { Plugin } from 'vue'

export default {
  install() {
    setHeadInjectionHandler(() => createHead())
  }
} satisfies Plugin
