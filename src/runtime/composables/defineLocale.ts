import type { Locale, LocalePair } from '../types/locale'

export function defineLocale(name: string, code: string, pair: LocalePair): Locale {
  return {
    name,
    code,
    ui: pair
  }
}
