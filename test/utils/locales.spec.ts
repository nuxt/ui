import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { generateI18nPlugin, getLocaleKeys, resolveLocaleKey } from '../../src/utils/locales'

const keys = getLocaleKeys(resolve(process.cwd(), 'src/runtime/locale'))

describe('i18n plugin', () => {
  it.each([
    ['fr', 'fr'],
    ['pt-BR', 'pt_br'],
    ['en-US', 'en'],
    [{ code: 'en', language: 'en-GB' }, 'en_gb'],
    [{ code: 'zh-Hant', language: 'zh-TW' }, 'zh_tw'],
    ['fa', 'fa_ir'],
    ['nb', 'nb_no'],
    ['zh', undefined],
    ['xx', undefined]
  ])('resolves %j to %s', (locale, key) => {
    expect(resolveLocaleKey(locale, keys)).toBe(key)
  })

  it('imports only the configured locales', () => {
    const contents = generateI18nPlugin(['en', { code: 'fr' }, { code: 'pt-BR', language: 'pt-BR' }, 'en-US', 'xx'], keys, '/runtime')

    expect(contents).toMatchInlineSnapshot(`
      "import { computed, unref } from "vue";
      import { defineNuxtPlugin } from "#app/nuxt";
      import { localeContextInjectionKey } from "/runtime/composables/useLocale";
      import en from "/runtime/locale/en";
      import fr from "/runtime/locale/fr";
      import pt_br from "/runtime/locale/pt_br";
      const locales = {
        en: en,
        fr: fr,
        "pt-BR": pt_br,
        "en-US": en
      }
      export default defineNuxtPlugin((nuxtApp) => {
        nuxtApp.vueApp.provide(localeContextInjectionKey, computed(() => locales[unref(nuxtApp.$i18n.locale)]))
      })"
    `)
  })
})
