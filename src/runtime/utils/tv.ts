import { createTV, type defaultConfig } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'

const appConfigTv = _appConfig as AppConfig & { ui: { tv: typeof defaultConfig } }

export const tv = createTV(appConfigTv.ui?.tv)
