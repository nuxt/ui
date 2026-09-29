import { readFile } from 'node:fs/promises'

const COMMENT = /\/\*[\s\S]*?\*\//g
const IMPORT = /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?([^;]*)/g
const TAILWIND = /^tailwindcss(?:\/[\w.-]+)?$/
// `prefix(...)` is an option of the theme, so it only applies on the imports that
// bring it: the whole of Tailwind CSS or `theme.css`, not `utilities.css`
const THEME = /^tailwindcss(?:\/(?:index|theme)(?:\.css)?)?$/
const PREFIX = /\bprefix\(\s*([\w-]+)\s*\)/

/**
 * The prefix a stylesheet gives Tailwind CSS, `@import "tailwindcss" prefix(tw)`.
 * A layered import carries it on `tailwindcss/theme.css`, where Tailwind CSS reads it.
 * @param css - The stylesheet source
 * @returns The prefix, `null` when Tailwind CSS is imported without one, `undefined` when it isn't imported
 */
export function getTailwindPrefix(css: string): string | null | undefined {
  let imported = false
  for (const [, specifier, params] of css.replace(COMMENT, '').matchAll(IMPORT)) {
    if (!TAILWIND.test(specifier!)) {
      continue
    }
    imported = true
    const prefix = THEME.test(specifier!) ? params!.match(PREFIX)?.[1] : undefined
    if (prefix) {
      return prefix
    }
  }
  return imported ? null : undefined
}

/**
 * Reads the Tailwind CSS prefix of the first stylesheet that imports Tailwind CSS.
 * @param paths - The stylesheets, in order
 * @returns The stylesheet and its prefix, or `undefined` when none imports Tailwind CSS
 */
export async function findTailwindPrefix(paths: string[]): Promise<{ path: string, prefix: string | null } | undefined> {
  for (const path of paths) {
    const css = await readFile(path, 'utf8').catch(() => undefined)
    const prefix = css === undefined ? undefined : getTailwindPrefix(css)
    if (prefix !== undefined) {
      return { path, prefix }
    }
  }
}
