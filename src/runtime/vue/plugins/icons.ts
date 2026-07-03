import { addIcon } from '@iconify/vue'
import { init } from 'virtual:nuxt-ui-icons'
import type { Plugin } from 'vue'

// `virtual:nuxt-ui-icons` only exposes `init(addIcon)` (a virtual module can't resolve a bare
// specifier like `@iconify/vue`), so this plugin owns that import and registers the bundled
// icons into Iconify's in-memory store. Running in `install` means it happens on both server
// and client, which is what lets the bundled icons render during SSR.
export default {
  install() {
    init(addIcon)
  }
} satisfies Plugin
