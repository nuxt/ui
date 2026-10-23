import { reactive } from 'vue'
import type { Plugin } from 'vue'
import { defu } from 'defu'
import { appConfigKey, useAppConfig } from '../composables/useAppConfig'

export default {
  install(app, options) {
    if (options?.ui) {
      // Provided per app rather than written to the shared config, so two apps in
      // one process (SSR, micro-frontends) keep their own theme
      const appConfig = useAppConfig()
      app.provide(appConfigKey, reactive({ ...appConfig, ui: defu(options.ui, appConfig.ui) }))
    }
  }
} satisfies Plugin
