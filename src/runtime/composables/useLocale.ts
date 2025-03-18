import { computed, inject, toRef } from 'vue'
import type { Ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { Locale, Messages } from '../types/locale'
import { buildLocaleContext, localeContextInjectionKey } from '../utils/locale'
import en from '../locale/en'

const _useLocale = (localeOverrides?: Ref<Locale<Messages> | undefined>) => {
  const locale = localeOverrides || toRef(inject<Locale<Messages>>(localeContextInjectionKey))

  return buildLocaleContext<Messages>(computed(() => locale.value || en))
}

export const useLocale = createSharedComposable(_useLocale)
