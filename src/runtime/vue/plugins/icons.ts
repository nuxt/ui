import { addIcon } from '@iconify/vue'
import { init } from 'virtual:nuxt-ui-icons'
import type { Plugin } from 'vue'

// `virtual:nuxt-ui-icons` only exposes `init(addIcon)` (a virtual module can't resolve a bare
// specifier like `@iconify/vue`), so this plugin owns that import and registers the bundled
// icons into Iconify's in-memory store. Running in `install` means it happens on both server
// and client, which is what lets the bundled icons render during SSR.
export default {
  install() {
    init((name, data) => {
      // `@iconify/vue` splits a colon-less lookup on its FIRST dash, so a multi-word collection
      // icon used as `i-material-symbols-menu` resolves to `material:symbols-menu` and would
      // miss the bundled `material-symbols:menu`. Register those under the dashed alias too —
      // it mis-splits the same way on both sides — so both forms find the bundled data.
      const colon = name.indexOf(':')
      if (colon !== -1 && name.slice(0, colon).includes('-')) {
        addIcon(name.replace(':', '-'), data)
      }

      return addIcon(name, data)
    })
  }
} satisfies Plugin
