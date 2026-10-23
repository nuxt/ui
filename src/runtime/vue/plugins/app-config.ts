import type { Plugin } from 'vue'
import { defu } from 'defu'
import { useAppConfig } from '../composables/useAppConfig'

const appConfig = useAppConfig()
// Read once, so every `app.use` merges over the build config rather than over the
// previous merge, which would repeat the classes of an array on each install (SSR).
const base = appConfig.ui

export default {
  install(_app, options) {
    if (options?.ui) {
      appConfig.ui = defu(options.ui, base)
    }
  }
} satisfies Plugin
