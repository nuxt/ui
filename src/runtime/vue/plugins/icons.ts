import { addIcon } from '@iconify/vue'
import { icons } from 'virtual:nuxt-ui-icons'
import type { Plugin } from 'vue'

// The virtual module only holds data (a virtual module can't resolve a bare import like
// `@iconify/vue`), so this plugin owns that import and registers each bundled icon into
// Iconify's in-memory store. Running in `install` means it happens on both server and
// client, which is what lets the bundled icons render during SSR.
export default {
  install() {
    for (const [name, data] of Object.entries(icons)) {
      addIcon(name, data)
    }
  }
} satisfies Plugin
