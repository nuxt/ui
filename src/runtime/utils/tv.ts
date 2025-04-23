import { createTV, type defaultConfig } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import appConfig from '#build/app.config'

const appConfigTv = appConfig as AppConfig & { ui: { tv: typeof defaultConfig } }

export const tv = /* @__PURE__ */ createTV(appConfigTv.ui?.tv)
