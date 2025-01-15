import { defu } from 'defu'
import type { Locale, Direction } from '../types/locale'

interface DefineLocaleOptions<M> {
  name: string
  code: string
  dir?: Direction
  messages: M
}

export function defineLocale<M>(options: DefineLocaleOptions<M>): Locale<M> {
  return defu<DefineLocaleOptions<M>, [{ dir: Direction }]>(options, { dir: 'ltr' })
}
