import { readFile } from 'node:fs/promises'

const COMMENT = /\/\*[\s\S]*?\*\//g
const IMPORT = /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?([^;]*)/g
// `prefix(...)` is an option of the theme, so it only applies on the imports that
// bring it: the whole of Tailwind CSS or `theme.css`, not `utilities.css`
const THEME = /^tailwindcss(?:\/(?:index|theme)(?:\.css)?)?$/
const PREFIX = /\bprefix\(\s*([\w-]+)\s*\)/
const WHOLE = /^tailwindcss(?:\/index\.css)?$/
const LAYER = /\blayer\(\s*([\w.-]+)\s*\)/

/**
 * The prefix a stylesheet gives Tailwind CSS, `@import "tailwindcss" prefix(tw)`.
 * A layered import carries it on `tailwindcss/theme.css`, where Tailwind CSS reads it.
 * @param css - The stylesheet source
 * @returns The prefix, `null` when Tailwind CSS's theme is imported without one, `undefined` when it isn't imported
 */
export function getTailwindPrefix(css: string): string | null | undefined {
  let imported = false
  for (const [, specifier, params] of css.replace(COMMENT, '').matchAll(IMPORT)) {
    // Only an import that brings the theme decides the prefix: one of just
    // `preflight.css` or `utilities.css` leaves it to another stylesheet
    if (!THEME.test(specifier!)) {
      continue
    }
    imported = true
    const prefix = params!.match(PREFIX)?.[1]
    if (prefix) {
      return prefix
    }
  }
  return imported ? null : undefined
}

/**
 * The cascade layer a stylesheet imports all of Tailwind CSS into,
 * `@import "tailwindcss" layer(framework)`.
 * @param css - The stylesheet source
 */
export function getTailwindLayer(css: string): string | undefined {
  for (const [, specifier, params] of css.replace(COMMENT, '').matchAll(IMPORT)) {
    const layer = WHOLE.test(specifier!) ? params!.match(LAYER)?.[1] : undefined
    if (layer) {
      return layer
    }
  }
}

/**
 * Reads the Tailwind CSS prefix of the first stylesheet that imports Tailwind CSS.
 * @param paths - The stylesheets, in order
 * @returns The stylesheet, its prefix and the layer it imports Tailwind CSS into, or `undefined` when none imports Tailwind CSS
 */
export async function findTailwindPrefix(paths: string[]): Promise<{ path: string, prefix: string | null, layer?: string } | undefined> {
  for (const path of paths) {
    const css = await readFile(path, 'utf8').catch(() => undefined)
    const prefix = css === undefined ? undefined : getTailwindPrefix(css)
    if (prefix !== undefined) {
      return { path, prefix, layer: getTailwindLayer(css!) }
    }
  }
}
