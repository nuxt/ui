import { join } from 'pathe'
import { createJiti } from 'jiti'
import type { UnpluginOptions } from 'unplugin'
import { defu } from 'defu'

import { getDefaultUiConfig } from '../defaults'
import type { NuxtUIOptions } from '../unplugin'

export default function AppConfigPlugin(options: NuxtUIOptions & { theme: NonNullable<NuxtUIOptions['theme']> }, appConfig: Record<string, any>) {
  return {
    name: 'nuxt:ui:app-config',
    vite: {
      async configResolved(config) {
        // load an `app.config.ts` in the root of the user's project (not source)
        const jiti = createJiti(config.root)
        const userAppConfig = await jiti.import(join(config.root, 'app.config'), { default: true, try: true }) ?? {}
        Object.assign(appConfig, defu(userAppConfig, { ui: getDefaultUiConfig(options.theme.colors) }))
      }
    },
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
