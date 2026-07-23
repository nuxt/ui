import type { UnpluginOptions } from 'unplugin'

const VUE_PLUGIN_ID = '@nuxt/ui/vue-plugin'

const MISSING_UNHEAD_MESSAGE = '[Nuxt UI] Could not resolve `@unhead/vue`, which is required when using Nuxt UI with Vue. Install it with `pnpm add @unhead/vue` and restart Vite.'

export default function UnheadPlugin() {
  return {
    name: 'nuxt:ui:unhead',
    enforce: 'pre',
    vite: {
      async resolveId(id, importer) {
        if (id !== VUE_PLUGIN_ID) {
          return
        }

        const unhead = await this.resolve('@unhead/vue', importer, { skipSelf: true })
        if (!unhead) {
          this.error(MISSING_UNHEAD_MESSAGE)
        }
      }
    }
  } satisfies UnpluginOptions
}
