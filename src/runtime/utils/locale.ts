import type { Ref } from 'vue'
import type { Locale, Direction } from '../types/locale'
import type { MaybeRef } from '@vueuse/core'
import { computed, isRef, ref, unref } from 'vue'
import { get } from './index'

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string
export type LocaleContext<M> = {
  locale: Ref<Locale<M>>
  lang: Ref<string>
  dir: Ref<Direction>
  code: Ref<string>
  t: Translator
}

export function buildTranslator<M>(locale: MaybeRef<Locale<M>>): Translator {
  return (path, option) => translate(path, option, unref(locale))
}

export function translate<M>(path: string, option: undefined | TranslatorOption, locale: Locale<M>): string {
  const prop: string = get(locale, `messages.${path}`, path)

  return prop.replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  )
}

export function buildLocaleContext<M>(locale: MaybeRef<Locale<M>>): LocaleContext<M> {
  const lang = computed(() => unref(locale).name)
  const code = computed(() => unref(locale).code)
  const dir = computed(() => unref(locale).dir)
  const localeRef = isRef(locale) ? locale : ref(locale) as Ref<Locale<M>>

  return {
    lang,
    code,
    dir,
    locale: localeRef,
    t: buildTranslator(locale)
  }
}
