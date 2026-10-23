import { hasInjectionContext, inject, reactive } from 'vue'
import type { InjectionKey } from 'vue'
import appConfig from '#build/app.config'

const _appConfig = reactive(appConfig)

/** The app config of one app, provided by the Vue plugin when it's given a `ui` option. */
export const appConfigKey: InjectionKey<typeof _appConfig> = Symbol('nuxt-ui.app-config')

export const useAppConfig = () => (hasInjectionContext() && inject(appConfigKey, null)) || _appConfig
