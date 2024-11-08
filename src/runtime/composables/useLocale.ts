import { computed, inject, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { Locale } from '../types/locale'
import { buildLocaleContext } from '../utils/locale'
import { en } from '../locale'

export const localeContextInjectionKey: InjectionKey<Ref<Locale | undefined>> = Symbol('nuxt-ui.locale-context')

export const useLocale = (localeOverrides?: Ref<Locale | undefined>) => {
  const locale = localeOverrides || inject(localeContextInjectionKey, ref())!

  return buildLocaleContext(computed(() => locale.value || en))
}
