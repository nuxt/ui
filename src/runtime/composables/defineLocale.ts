import { defu } from 'defu'
import type { Locale, Direction, Messages } from '../types/locale'

interface DefineLocaleOptions {
  name: string
  code: string
  dir?: Direction
  messages: Messages
}

export function defineLocale(options: DefineLocaleOptions): Locale {
  return defu<DefineLocaleOptions, [{ dir: Direction }]>(options, { dir: 'ltr' })
}
