import { promises as fsp } from 'node:fs'

export async function sortFile(path) {
  const file = await fsp.readFile(path, 'utf-8')

  const lines = file.trim().split('\n').sort()

  await fsp.writeFile(path, lines.join('\n') + '\n')
}

export async function appendFile(path, contents) {
  const file = await fsp.readFile(path, 'utf-8')

  if (!file.includes(contents)) {
    await fsp.writeFile(path, file.trim() + '\n' + contents + '\n')
  }
}

/**
 * Insert a `key?: Partial<ComponentTypes.XProps>` entry into the `ThemeDefaults`
 * interface in `src/runtime/composables/useComponentProps.ts`, keeping entries
 * sorted alphabetically and avoiding duplicates.
 */
export async function appendThemeDefault(path, key, propsType) {
  const file = await fsp.readFile(path, 'utf-8')
  const entry = `  ${key}?: Partial<ComponentTypes.${propsType}>`

  const match = file.match(/(export interface ThemeDefaults \{\n)([\s\S]*?)(\n\})/)
  if (!match) return

  const [, header, body, footer] = match
  if (body.split('\n').includes(entry)) return

  const sorted = [...body.split('\n'), entry].sort().join('\n')
  await fsp.writeFile(path, file.replace(match[0], header + sorted + footer))
}

export function normalizeLocale(locale) {
  if (!locale) {
    return ''
  }

  if (locale.includes('_')) {
    return locale.split('_')
      .map((part, index) => index === 0 ? part.toLowerCase() : part.toUpperCase())
      .join('-')
  }

  return locale.toLowerCase()
}
