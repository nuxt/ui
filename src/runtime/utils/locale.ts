import type { Ref } from 'vue'
import type { Locale, LocalePair } from '../types/locale'
import type { MaybeRef } from '@vueuse/core'
import { computed, isRef, ref, unref } from 'vue'
import { get } from './index'

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string
export type LocaleContext = {
  locale: Ref<Locale>
  lang: Ref<string>
  t: Translator
}

export function buildTranslator(locale: MaybeRef<Locale>): Translator {
  return (path, option) => translate(path, option, unref(locale))
}

export function translate(path: string, option: undefined | TranslatorOption, locale: Locale): string {
  const prop: string = get(locale, path, path)

  return prop.replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  )
}

export function buildLocaleContext(locale: MaybeRef<Locale>): LocaleContext {
  const lang = computed(() => unref(locale).name)
  const localeRef = isRef(locale) ? locale : ref(locale)

  return {
    lang,
    locale: localeRef,
    t: buildTranslator(locale)
  }
}

export function defineLocale(name: string, pair: LocalePair): Locale {
  return {
    name,
    ui: pair
  }
}
