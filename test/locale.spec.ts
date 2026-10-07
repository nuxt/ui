import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import * as locales from '../src/runtime/locale'
import en from '../src/runtime/locale/en'
import type { Locale, Messages } from '../src/runtime/types/locale'

const localeDir = resolve(process.cwd(), 'src/runtime/locale')
const files = readdirSync(localeDir).filter(file => file.endsWith('.ts') && file !== 'index.ts').map(file => file.replace(/\.ts$/, ''))
const entries = Object.entries(locales) as [string, Locale<Messages>][]

// Deliberate deviations from the CLDR own-language name, kept because they are
// clearer in a language picker (e.g. `简体中文` over `中文（中国）`).
const nameExceptions: Record<string, string> = {
  az: 'Azərbaycanca',
  ckb: 'کوردی',
  fa_ir: 'فارسی',
  id: 'Bahasa Indonesia',
  kk: 'Қазақша',
  km: 'ភាសាខ្មែរ',
  nb_no: 'Norsk Bokmål',
  ug_cn: 'ئۇيغۇرچە',
  uz: 'Oʻzbek',
  zh_cn: '简体中文',
  zh_tw: '繁體中文'
}

function normalizeLocale(locale: string): string {
  if (locale.includes('_')) {
    return locale.split('_').map((part, index) => index === 0 ? part.toLowerCase() : part.toUpperCase()).join('-')
  }
  return locale.toLowerCase()
}

function flatten(messages: object, prefix = '', result: Record<string, string> = {}): Record<string, string> {
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object') {
      flatten(value, path, result)
    } else {
      result[path] = value
    }
  }
  return result
}

function placeholders(message: string): string {
  return [...message.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort().join(',')
}

const enMessages = flatten(en.messages)

describe('locales', () => {
  it('exports every locale file from the index under its filename', () => {
    expect(Object.keys(locales).sort()).toEqual(files.sort())
  })

  it('keeps the index exports sorted alphabetically', () => {
    const lines = readFileSync(`${localeDir}/index.ts`, 'utf-8').trim().split('\n')
    expect(lines).toEqual([...lines].sort())
  })

  it('has a unique code per locale', () => {
    const codes = entries.map(([, locale]) => locale.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  describe.each(entries)('%s', (key, locale) => {
    it('has a code matching its filename', () => {
      expect(locale.code).toBe(normalizeLocale(key))
    })

    it('has a code known to CLDR', () => {
      const language = locale.code.split('-')[0]!
      // `Intl.DisplayNames` echoes the input back when the code is unknown
      expect(new Intl.DisplayNames(['en'], { type: 'language' }).of(language)).not.toBe(language)
    })

    it('has the exact same message keys as en', () => {
      expect(Object.keys(flatten(locale.messages)).sort()).toEqual(Object.keys(enMessages).sort())
    })

    it('has no empty message', () => {
      for (const [path, message] of Object.entries(flatten(locale.messages))) {
        expect(message?.trim(), path).toBeTruthy()
      }
    })

    it('has the same placeholders as en in every message', () => {
      const messages = flatten(locale.messages)
      for (const [path, message] of Object.entries(enMessages)) {
        expect(placeholders(messages[path]!), path).toBe(placeholders(message))
      }
    })

    it('has the direction CLDR expects', () => {
      const intlLocale = new Intl.Locale(locale.code) as Intl.Locale & { getTextInfo?: () => { direction: string }, textInfo?: { direction: string } }
      const direction = intlLocale.getTextInfo?.().direction ?? intlLocale.textInfo?.direction ?? 'ltr'
      expect(locale.dir).toBe(direction)
    })

    it('is named after the CLDR own-language name', () => {
      if (nameExceptions[key]) {
        expect(locale.name).toBe(nameExceptions[key])
        return
      }
      const names = ['standard', 'dialect'].map(languageDisplay =>
        new Intl.DisplayNames([locale.code], { type: 'language', languageDisplay: languageDisplay as Intl.DisplayNamesOptions['languageDisplay'] }).of(locale.code)?.toLowerCase()
      )
      expect(names, `CLDR names for ${locale.code}`).toContain(locale.name.toLowerCase())
    })
  })
})
