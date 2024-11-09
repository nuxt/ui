import type { Locale, LocalePair } from '../types/locale'

export function defineLocale(name: string, pair: LocalePair): Locale {
  return {
    name,
    ui: pair
  }
}
