import { computed, inject, toRef } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { Locale, Messages } from '../types/locale'
import { buildLocaleContext } from '../utils/locale'
import en from '../locale/en'

export const localeContextInjectionKey: InjectionKey<Ref<Locale<unknown> | undefined>> = Symbol.for('nuxt-ui.locale-context')

const _useLocale = (localeOverrides?: Ref<Locale<Messages> | undefined>) => {
  const locale = localeOverrides || toRef(inject<Locale<Messages>>(localeContextInjectionKey, en))

  return buildLocaleContext<Messages>(computed(() => locale.value || en))
}

export const useLocale = /* @__PURE__ */ import.meta.client ? createSharedComposable(_useLocale) : _useLocale
