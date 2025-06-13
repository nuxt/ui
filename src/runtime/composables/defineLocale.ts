import { defu } from 'defu'
import type { Locale, Direction } from '../types/locale'
import type { DeepPartial } from '../types/utils'

interface DefineLocaleOptions<M> {
  name: string
  code: string
  dir?: Direction
  messages: M
}

/* @__NO_SIDE_EFFECTS__ */
export function defineLocale<M>(options: DefineLocaleOptions<M>): Locale<M> {
  return defu<DefineLocaleOptions<M>, [{ dir: Direction }]>(options, { dir: 'ltr' })
}

/* @__NO_SIDE_EFFECTS__ */
export function extendLocale<M>(locale: Locale<M>, options: Partial<DefineLocaleOptions<DeepPartial<M>>>): Locale<M> {
  return defu<Locale<M>, [DefineLocaleOptions<M>]>(options, locale)
}
