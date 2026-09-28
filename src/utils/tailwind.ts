import { readFile } from 'node:fs/promises'

const COMMENT = /\/\*[\s\S]*?\*\//g
const TAILWIND_IMPORT = /@import\s+["']tailwindcss(?:\/[\w.-]+)?["']([^;]*)/g
const PREFIX = /\bprefix\(\s*([\w-]+)\s*\)/

/**
 * The prefix a stylesheet gives Tailwind CSS, `@import "tailwindcss" prefix(tw)`.
 * A layered import carries it on one of its imports, usually `tailwindcss/theme.css`.
 * @param css - The stylesheet source
 * @returns The prefix, `null` when Tailwind CSS is imported without one, `undefined` when it isn't imported
 */
export function getTailwindPrefix(css: string): string | null | undefined {
  let imported = false
  for (const [, params] of css.replace(COMMENT, '').matchAll(TAILWIND_IMPORT)) {
    imported = true
    const prefix = params!.match(PREFIX)?.[1]
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
