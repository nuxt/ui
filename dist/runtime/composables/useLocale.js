import { computed, inject, toRef } from "vue";
import { createSharedComposable } from "@vueuse/core";
import { buildLocaleContext } from "../utils/locale.js";
import en from "../locale/en.js";
export const localeContextInjectionKey = Symbol.for("nuxt-ui.locale-context");
const _useLocale = (localeOverrides) => {
  const locale = localeOverrides || toRef(inject(localeContextInjectionKey, en));
  return buildLocaleContext(computed(() => locale.value || en));
};
export const useLocale = import.meta.client ? createSharedComposable(_useLocale) : _useLocale;
