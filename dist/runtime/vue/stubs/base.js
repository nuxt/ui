import { ref, onScopeDispose } from "vue";
import { createHooks } from "hookable";
import { useColorMode as useColorModeVueUse } from "@vueuse/core";
import appConfig from "#build/app.config";
export { useHead } from "@unhead/vue";
export { useAppConfig } from "../composables/useAppConfig.js";
export { defineShortcuts } from "../../composables/defineShortcuts.js";
export { defineLocale } from "../../composables/defineLocale.js";
export { useLocale } from "../../composables/useLocale.js";
export const clearError = () => {
};
export const useColorMode = () => {
  if (!appConfig.colorMode) {
    return {
      forced: true
    };
  }
  const { store, system } = useColorModeVueUse();
  return {
    get preference() {
      return store.value === "auto" ? "system" : store.value;
    },
    set preference(value) {
      store.value = value === "system" ? "auto" : value;
    },
    get value() {
      return store.value === "auto" ? system.value : store.value;
    },
    forced: false
  };
};
export const useCookie = (_name, _options = {}) => {
  const value = ref(_options?.default?.() ?? null);
  return {
    value: value.value,
    get: () => value.value,
    set: () => {
    },
    update: () => {
    },
    refresh: () => Promise.resolve(value.value),
    remove: () => {
    }
  };
};
const state = {};
export const useState = (key, init) => {
  if (state[key]) {
    return state[key];
  }
  const value = ref(init());
  state[key] = value;
  return value;
};
const hooks = createHooks();
export function useNuxtApp() {
  return {
    isHydrating: true,
    payload: { serverRendered: import.meta.env.SSR || false },
    hooks,
    hook: hooks.hook
  };
}
export function useRuntimeHook(name, fn) {
  const nuxtApp = useNuxtApp();
  const unregister = nuxtApp.hook(name, fn);
  onScopeDispose(unregister);
}
export function useRuntimeConfig() {
  return {
    app: {
      baseURL: "/"
    },
    public: {}
  };
}
export function defineNuxtPlugin(plugin) {
  return {
    install(app) {
      app.runWithContext(() => plugin({ vueApp: app }));
    }
  };
}
