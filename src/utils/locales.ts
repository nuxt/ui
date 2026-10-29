import { readdirSync } from 'node:fs'
import { genDynamicImport, genImport, genObjectFromRawEntries, genString } from 'knitwork'
import { join } from 'pathe'

export type I18nLocale = string | { code: string, language?: string }

export function getLocaleKeys(localeDir: string): string[] {
  return readdirSync(localeDir)
    .map(file => file.match(/^([a-z_]+)\.[jt]s$/)?.[1])
    .filter((key): key is string => !!key && key !== 'index')
}

export function resolveLocaleKey(locale: I18nLocale, keys: string[]): string | undefined {
  const tags = (typeof locale === 'string' ? [locale] : [locale.language, locale.code]).filter((tag): tag is string => !!tag)
  const candidates = [...tags, ...tags.map(tag => tag.split(/[-_]/)[0]!)].map(tag => tag.toLowerCase().replace(/-/g, '_'))

  const key = candidates.find(key => keys.includes(key))
  if (key) {
    return key
  }

  // A language with a single regional locale (`fa` uses `fa_ir`)
  for (const candidate of candidates) {
    const regional = keys.filter(key => key.startsWith(`${candidate}_`))
    if (regional.length === 1) {
      return regional[0]
    }
  }
}

export function generateI18nPlugin(locales: I18nLocale[], keys: string[], runtimeDir: string): string {
  const loaders = new Map<string, string>()
  const entries: [string, string][] = []

  for (const locale of locales) {
    const key = resolveLocaleKey(locale, keys)
    if (!key) {
      continue
    }

    // `en` is already in the entry through `useLocale`
    if (key !== 'en') {
      loaders.set(key, genDynamicImport(join(runtimeDir, 'locale', key)))
    }
    entries.push([typeof locale === 'string' ? locale : locale.code, genString(key)])
  }

  return [
    genImport('vue', ['computed', 'shallowReactive', 'unref']),
    genImport('#app/nuxt', ['defineNuxtPlugin']),
    genImport(join(runtimeDir, 'composables/useLocale'), ['localeContextInjectionKey']),
    genImport(join(runtimeDir, 'locale/en'), 'en'),
    `const locales = ${genObjectFromRawEntries(entries)}`,
    `const loaders = ${genObjectFromRawEntries([...loaders])}`,
    `export default defineNuxtPlugin(async (nuxtApp) => {`,
    `  const loaded = shallowReactive({ en })`,
    `  const load = async (code) => {`,
    `    const key = locales[code]`,
    `    if (key && !loaded[key]) {`,
    `      loaded[key] = (await loaders[key]()).default`,
    `    }`,
    `  }`,
    `  // Load the next locale before \`@nuxtjs/i18n\` switches to it`,
    `  nuxtApp.hook('i18n:beforeLocaleSwitch', ({ newLocale }) => load(newLocale))`,
    `  nuxtApp.vueApp.provide(localeContextInjectionKey, computed(() => {`,
    `    const code = unref(nuxtApp.$i18n?.locale)`,
    `    // A locale set without the hook, or changed by a later one`,
    `    load(code)`,
    `    return loaded[locales[code]]`,
    `  }))`,
    `  await load(unref(nuxtApp.$i18n?.locale))`,
    `})`
  ].join('\n')
}
