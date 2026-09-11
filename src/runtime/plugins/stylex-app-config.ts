import compiled from '#build/ui-stylex-app-config'
import { defineNuxtPlugin, useAppConfig } from '#imports'

const skip = new Set(['colors', 'icons', 'prefix', 'tv', 'engine'])

export default defineNuxtPlugin({
  name: 'nuxt-ui:stylex-app-config',
  enforce: 'pre',
  setup() {
    const appConfig = useAppConfig()
    if (!appConfig.ui || !compiled) return
    for (const [key, value] of Object.entries(compiled as Record<string, unknown>)) {
      if (skip.has(key) || value == null) continue
      ;(appConfig.ui as Record<string, unknown>)[key] = value
    }
  }
})
