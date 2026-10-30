import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'pathe'
import { colorName, colors } from '../runtime/theme/color'

const COMMENT = /\/\*[\s\S]*?\*\//g
const IMPORT = /@import\s+(?:url\(\s*)?["']([^"']+)["']\s*\)?([^;]*)/g
// `prefix(...)` is an option of the theme, so it only applies on the imports that
// bring it: the whole of Tailwind CSS or `theme.css`, not `utilities.css`
const THEME = /^tailwindcss(?:\/(?:index|theme)(?:\.css)?)?$/
const PREFIX = /\bprefix\(\s*([\w-]+)\s*\)/
const WHOLE = /^tailwindcss(?:\/index\.css)?$/
const LAYER = /\blayer\(\s*([\w.-]+)\s*\)/
const RELATIVE = /^\.{1,2}\//
// The imports Tailwind CSS inlines: it leaves `@import url(...)` as it is
const INLINED_IMPORT = /@import\s+["']([^"']+)["']/g

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

type TailwindImport = { path: string, prefix: string | null, layer?: string }

// A stylesheet often leaves the import to one it imports, `@import "./tailwind.css"`.
// Only relative imports are followed: an alias or a package needs the bundler to resolve.
async function readTailwindImport(path: string, seen: Set<string>): Promise<TailwindImport | undefined> {
  if (seen.has(path)) {
    return
  }
  seen.add(path)
  const css = await readFile(path, 'utf8').catch(() => undefined)
  if (css === undefined) {
    return
  }
  const prefix = getTailwindPrefix(css)
  if (prefix !== undefined) {
    return { path, prefix, layer: getTailwindLayer(css) }
  }
  for (const [, specifier] of css.replace(COMMENT, '').matchAll(IMPORT)) {
    const found = RELATIVE.test(specifier!) ? await readTailwindImport(resolve(dirname(path), specifier!), seen) : undefined
    if (found) {
      return found
    }
  }
}

/**
 * Reads the Tailwind CSS prefix of the first stylesheet that imports Tailwind CSS,
 * itself or through a relative `@import`.
 * @param paths - The stylesheets, in order
 * @returns The stylesheet, its prefix and the layer it imports Tailwind CSS into, or `undefined` when none imports Tailwind CSS
 */
export async function findTailwindPrefix(paths: string[]): Promise<TailwindImport | undefined> {
  const seen = new Set<string>()
  for (const path of paths) {
    const found = await readTailwindImport(path, seen)
    if (found) {
      return found
    }
  }
}

const COLORS_PLUGIN = /@plugin\s+["']@nuxt\/ui\/colors["']\s*\{([^}]*)\}/g
const OPTION = /(?:^|;)\s*([\w-]+)\s*:/g

/**
 * The colors a stylesheet adds in `@plugin "@nuxt/ui/colors" { tertiary: indigo; }`,
 * the seven aliases left out. A name the plugin rejects is left out too, it fails the build.
 * @param css - The stylesheet source
 */
export function getAddedColors(css: string): string[] {
  const names: string[] = []
  for (const [, block] of css.replace(COMMENT, '').matchAll(COLORS_PLUGIN)) {
    for (const [, name] of block!.matchAll(OPTION)) {
      if (!(colors as readonly string[]).includes(name!) && colorName.test(name!) && !names.includes(name!)) {
        names.push(name!)
      }
    }
  }
  return names
}

async function readAddedColors(path: string, seen: Set<string>, names: Set<string>) {
  if (seen.has(path)) {
    return
  }
  seen.add(path)
  const css = await readFile(path, 'utf8').catch(() => undefined)
  if (css === undefined) {
    return
  }
  getAddedColors(css).forEach(name => names.add(name))
  for (const [, specifier] of css.replace(COMMENT, '').matchAll(INLINED_IMPORT)) {
    if (RELATIVE.test(specifier!)) {
      await readAddedColors(resolve(dirname(path), specifier!), seen, names)
    }
  }
}

/**
 * Reads the colors the stylesheets add, themselves or through a relative `@import`.
 * @param paths - The stylesheets
 * @param seen - Filled with every stylesheet read, the imported ones included
 */
export async function findAddedColors(paths: string[], seen = new Set<string>()): Promise<string[]> {
  const names = new Set<string>()
  for (const path of paths) {
    await readAddedColors(path, seen, names)
  }
  return [...names]
}

/**
 * The declaration that types the added colors in every `color` prop.
 * @param names - The added colors
 */
export function getColorsDeclaration(names: string[]): string {
  if (!names.length) {
    return ''
  }
  return `declare module '@nuxt/ui' {
  interface UIColors {
${names.map(name => `    ${JSON.stringify(name)}: true`).join('\n')}
  }
}
`
}
