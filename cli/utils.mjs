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
 * interface in `src/runtime/types/theme.ts` before the first top-level entry
 * that sorts after it, so comments and nested blocks stay where they are.
 */
export async function appendThemeDefault(path, key, propsType) {
  const file = await fsp.readFile(path, 'utf-8')
  const entry = `  ${key}?: Partial<ComponentTypes.${propsType}>`

  const match = file.match(/(export interface ThemeDefaults \{\n)([\s\S]*?)(\n\})/)
  if (!match) {
    console.warn(`Could not find the \`ThemeDefaults\` interface in ${path}, add \`${key}\` manually.`)
    return
  }

  const [, header, body, footer] = match
  const lines = body.split('\n')
  if (lines.includes(entry)) return

  let index = lines.findIndex(line => /^ {2}\w+\?:/.test(line) && line > entry)
  if (index === -1) {
    index = lines.length
  } else {
    // keep a comment attached to the entry it documents
    while (index > 0 && /^ {2}(?:\/\/|\/\*\*| \*)/.test(lines[index - 1])) index--
  }

  lines.splice(index, 0, entry)
  await fsp.writeFile(path, file.replace(match[0], header + lines.join('\n') + footer))
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
