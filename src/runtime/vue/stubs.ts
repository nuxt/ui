import { ref } from 'vue'
import type { Ref, Plugin as VuePlugin } from 'vue'

import appConfig from '#build/app.config'
import type { NuxtApp } from '#app'

export { useHead } from '@unhead/vue'
export { useRoute, useRouter } from 'vue-router'

export const useAppConfig = () => appConfig

const state: Record<string, any> = {}

export const useState = <T>(key: string, init: () => T): Ref<T> => {
  if (state[key]) {
    return state[key] as Ref<T>
  }
  const value = ref(init())
  state[key] = value
  return value as Ref<T>
}

export function useNuxtApp() {
  return {
    isHydrating: true,
    payload: { serverRendered: false }
  }
}

export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void) {
  return {
    install(app) {
      plugin({ vueApp: app } as NuxtApp)
    }
  } satisfies VuePlugin
}
