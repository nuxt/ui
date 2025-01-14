import { computed, inject, toRef } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { Locale, Messages } from '../types/locale'
import { buildLocaleContext } from '../utils/locale'
import en from '../locale/en'
import { createSharedComposable } from '@vueuse/core'

export const localeContextInjectionKey: InjectionKey<Ref<Locale<unknown> | undefined>> = Symbol('nuxt-ui.locale-context')

const _useLocale = (localeOverrides?: Ref<Locale<Messages> | undefined>) => {
  const locale = localeOverrides || toRef(inject<Locale<Messages>>(localeContextInjectionKey))

  return buildLocaleContext<Messages>(computed(() => locale.value || en))
}

export const useLocale = createSharedComposable(_useLocale)
