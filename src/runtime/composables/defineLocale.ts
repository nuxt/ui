import type { Locale, Direction, LocalePair } from '../types/locale'
import { defu } from 'defu'

interface DefineLocaleOptions {
  name: string
  code: string
  dir?: Direction
  ui: LocalePair
}

export function defineLocale(options: DefineLocaleOptions): Locale {
  return defu<DefineLocaleOptions, [{ dir: Direction }]>(options, { dir: 'ltr' })
}
