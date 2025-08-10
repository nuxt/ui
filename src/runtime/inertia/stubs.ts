import { ref, onScopeDispose } from 'vue'
import type { Ref, Plugin as VuePlugin } from 'vue'
import { createHooks } from 'hookable'
import { usePage } from '@inertiajs/vue3'
import { useColorMode as useColorModeVueUse } from '@vueuse/core'
import appConfig from '#build/app.config'
import type { NuxtApp } from '#app'

export { useHead } from '@unhead/vue'

export { useAppConfig } from '../vue/composables/useAppConfig'
export { defineShortcuts } from '../composables/defineShortcuts'
export { defineLocale } from '../composables/defineLocale'
export { useLocale } from '../composables/useLocale'

export const useRoute = () => {
  const page = usePage()

  return {
    fullPath: page.url
  }
}

export const useRouter = () => {

}

export const clearError = () => {

}

export const useColorMode = () => {
  if (!appConfig.colorMode) {
    return {
      forced: true
    }
  }

  const { store, system } = useColorModeVueUse()

  return {
    get preference() { return store.value === 'auto' ? 'system' : store.value },
    set preference(value) { store.value = value === 'system' ? 'auto' : value },
    get value() { return store.value === 'auto' ? system.value : store.value },
    forced: false
  }
}

export const useCookie = <T = string>(
  _name: string,
  _options: Record<string, any> = {}
) => {
  const value = ref(null) as Ref<T>

  return {
    value,
    get: () => value.value,
    set: () => {},
    update: () => {},
    refresh: () => Promise.resolve(value.value),
    remove: () => {}
  }
}

const state: Record<string, any> = {}

export const useState = <T>(key: string, init: () => T): Ref<T> => {
  if (state[key]) {
    return state[key] as Ref<T>
  }
  const value = ref(init())
  state[key] = value
  return value as Ref<T>
}

const hooks = createHooks()

export function useNuxtApp() {
  return {
    isHydrating: true,
    payload: { serverRendered: false },
    hooks,
    hook: hooks.hook
  }
}

export function useRuntimeHook(name: string, fn: (...args: any[]) => void): void {
  const nuxtApp = useNuxtApp()

  const unregister = nuxtApp.hook(name, fn)

  onScopeDispose(unregister)
}

export function defineNuxtPlugin(plugin: (nuxtApp: NuxtApp) => void) {
  return {
    install(app) {
      app.runWithContext(() => plugin({ vueApp: app } as NuxtApp))
    }
  } satisfies VuePlugin
}
