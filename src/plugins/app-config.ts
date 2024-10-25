import type { UnpluginOptions } from 'unplugin'

import type { NuxtUIOptions } from '../unplugin'

/**
 * This plugin injects Nuxt UI configuration into the runtime build so Nuxt UI components can
 * access it.
 */
export default function AppConfigPlugin(options: NuxtUIOptions & { theme: NonNullable<NuxtUIOptions['theme']> }, appConfig: Record<string, any>) {
  return {
    name: 'nuxt:ui:app-config',
    enforce: 'pre',
    resolveId(id) {
      if (id === '#build/app.config') {
        return 'virtual:nuxt-ui-app-config'
      }
    },
    loadInclude: id => id === 'virtual:nuxt-ui-app-config',
    load() {
      return `
          export default ${JSON.stringify(appConfig!)}
        `
    }
  } satisfies UnpluginOptions
}
