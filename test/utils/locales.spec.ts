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

  it('lazy loads only the configured locales', () => {
    const contents = generateI18nPlugin(['en', { code: 'fr' }, { code: 'pt-BR', language: 'pt-BR' }, 'en-US', 'xx'], keys, '/runtime')

    expect(contents).toMatchInlineSnapshot(`
      "import { computed, shallowReactive, unref, watch } from "vue";
      import { defineNuxtPlugin } from "#app/nuxt";
      import { localeContextInjectionKey } from "/runtime/composables/useLocale";
      import en from "/runtime/locale/en";
      const locales = {
        en: "en",
        fr: "fr",
        "pt-BR": "pt_br",
        "en-US": "en"
      }
      const loaders = {
        fr: () => import("/runtime/locale/fr"),
        pt_br: () => import("/runtime/locale/pt_br")
      }
      export default defineNuxtPlugin(async (nuxtApp) => {
        const loaded = shallowReactive({ en })
        const load = async (code) => {
          const key = locales[code]
          if (key && !loaded[key]) {
            loaded[key] = await loaders[key]().then(r => r.default).catch(() => undefined)
          }
        }
        // Load the next locale before \`@nuxtjs/i18n\` switches to it
        nuxtApp.hook('i18n:beforeLocaleSwitch', ({ newLocale }) => load(newLocale))
        if (import.meta.client) {
          // A locale set without the hook, or changed by a later one
          nuxtApp.hook('app:created', () => watch(() => unref(nuxtApp.$i18n?.locale), load, { immediate: true }))
        }
        nuxtApp.vueApp.provide(localeContextInjectionKey, computed(() => loaded[locales[unref(nuxtApp.$i18n?.locale)]]))
        await load(unref(nuxtApp.$i18n?.locale))
      })"
    `)
  })
})
