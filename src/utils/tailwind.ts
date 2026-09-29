import { readFile } from 'node:fs/promises'
import { dirname, isAbsolute, join, resolve } from 'pathe'

const COMMENT = /\/\*[\s\S]*?\*\//g
const IMPORT = /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?([^;]*)/g
const TAILWIND = /^tailwindcss(?:\/[\w.-]+)?$/
const NUXT_UI = /^@nuxt\/ui(?:\/(?:base|sources))?$/
const PREFIX = /\bprefix\(\s*([\w-]+)\s*\)/
const WHOLE = /^tailwindcss(?:\/index\.css)?$/
const LAYER = /\blayer\(\s*([\w.-]+)\s*\)/

/**
 * The prefix a stylesheet gives Tailwind CSS, `@import "tailwindcss" prefix(tw)`.
 * A layered import carries it on one of its imports, usually `tailwindcss/theme.css`.
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

export interface TailwindStylesheets {
  /** Each stylesheet that imports Tailwind CSS, in order, with its prefix. */
  tailwind: Array<{ path: string, prefix: string | null, layer?: string }>
  /** The stylesheets that import Nuxt UI where no Tailwind CSS import was found. */
  unresolved: string[]
}

/**
 * Reads the Tailwind CSS prefix of the given stylesheets and of the local ones
 * they `@import`, relative, absolute or through an alias like `~/`.
 * @param paths - The stylesheets, in order
 * @param alias - Path aliases, like Nuxt's `~` and `@`
 */
export async function findTailwindStylesheets(paths: string[], alias: Record<string, string> = {}): Promise<TailwindStylesheets> {
  const result: TailwindStylesheets = { tailwind: [], unresolved: [] }
  const visited = new Set<string>()

  function local(specifier: string, from: string): string | undefined {
    if (specifier.startsWith('.')) {
      return resolve(dirname(from), specifier)
    }
    if (isAbsolute(specifier)) {
      return specifier
    }
    const key = Object.keys(alias).find(key => specifier.startsWith(`${key}/`))
    return key ? join(alias[key]!, specifier.slice(key.length + 1)) : undefined
  }

  // Whether this stylesheet or one it imports imports Tailwind CSS
  async function read(path: string): Promise<boolean> {
    if (visited.has(path)) {
      return false
    }
    visited.add(path)
    const css = await readFile(path, 'utf8').catch(() => undefined)
    if (css === undefined) {
      return false
    }
    const prefix = getTailwindPrefix(css)
    let found = prefix !== undefined
    if (found) {
      result.tailwind.push({ path, prefix: prefix!, layer: getTailwindLayer(css) })
    }
    let importsUi = false
    for (const [, specifier] of css.replace(COMMENT, '').matchAll(IMPORT)) {
      if (NUXT_UI.test(specifier!)) {
        importsUi = true
        continue
      }
      const next = local(specifier!, path)
      if (next && await read(next)) {
        found = true
      }
    }
    if (importsUi && !found) {
      result.unresolved.push(path)
    }
    return found
  }

  for (const path of paths) {
    await read(path)
  }
  return result
}
