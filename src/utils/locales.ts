import { readdirSync } from 'node:fs'
import { genImport, genObjectFromRawEntries } from 'knitwork'
import { join } from 'pathe'

export type I18nLocale = string | { code: string, language?: string }

export function getLocaleKeys(localeDir: string): string[] {
  return readdirSync(localeDir)
    .map(file => file.match(/^([a-z_]+)\.[jt]s$/)?.[1])
    .filter((key): key is string => !!key && key !== 'index')
}

export function resolveLocaleKey(locale: I18nLocale, keys: string[]): string | undefined {
  const tags = (typeof locale === 'string' ? [locale] : [locale.language, locale.code]).filter((tag): tag is string => !!tag)
  const candidates = [...tags, ...tags.map(tag => tag.split(/[-_]/)[0]!)]

  return candidates.map(tag => tag.toLowerCase().replace(/-/g, '_')).find(key => keys.includes(key))
}

export function generateI18nPlugin(locales: I18nLocale[], keys: string[], runtimeDir: string): string {
  const imports = new Set<string>()
  const entries: [string, string][] = []

  for (const locale of locales) {
    const key = resolveLocaleKey(locale, keys)
    if (!key) {
      continue
    }

    imports.add(key)
    entries.push([typeof locale === 'string' ? locale : locale.code, key])
  }

  return [
    genImport('vue', ['computed', 'unref']),
    genImport('#app/nuxt', ['defineNuxtPlugin']),
    genImport(join(runtimeDir, 'composables/useLocale'), ['localeContextInjectionKey']),
    ...[...imports].map(key => genImport(join(runtimeDir, 'locale', key), key)),
    `const locales = ${genObjectFromRawEntries(entries)}`,
    `export default defineNuxtPlugin((nuxtApp) => {`,
    `  nuxtApp.vueApp.provide(localeContextInjectionKey, computed(() => locales[unref(nuxtApp.$i18n.locale)]))`,
    `})`
  ].join('\n')
}
