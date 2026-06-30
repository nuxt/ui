import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { glob } from 'tinyglobby'
import type { UnpluginOptions } from 'unplugin'
import { getIconData } from '@iconify/utils'
import { loadCollectionFromFS } from '@iconify/utils/lib/loader/fs'
import { getClientBundleIcons, parseIconName } from '../utils/icons'
import type { NuxtUIOptions } from '../unplugin'

const VIRTUAL_ID = 'virtual:nuxt-ui-icons'

type IconData = NonNullable<ReturnType<typeof getIconData>>
type ClientBundle = Exclude<NonNullable<NonNullable<NuxtUIOptions['icon']>['clientBundle']>, false>
type ScanOptions = NonNullable<ClientBundle['scan']>

// Mirrors `@nuxt/icon`'s `clientBundle.scan` defaults.
const SCAN_GLOB_INCLUDE = ['**/*.{vue,jsx,tsx,md,mdc,mdx,yml,yaml}']
const SCAN_GLOB_EXCLUDE = ['node_modules', 'dist', 'build', 'coverage', 'test', 'tests', '.*']

/**
 * Resolve the `{collection}:{name}` icons to embed: Nuxt UI's own defaults plus any the
 * user lists in `icon.clientBundle.icons`. Names whose collection isn't installed are kept
 * here and dropped later by {@link loadIconsData} (which loads best-effort), so an
 * uninstalled collection degrades to runtime loading instead of breaking the build.
 */
function resolveBundleNames(options: NuxtUIOptions, appConfig: Record<string, any>): string[] {
  // Nuxt UI's defaults — already restricted to trusted, single-word collections.
  const names = new Set(getClientBundleIcons(appConfig.ui?.icons))

  // User additions can be from any collection.
  const clientBundle = options.icon?.clientBundle
  if (clientBundle && Array.isArray(clientBundle.icons)) {
    for (const icon of clientBundle.icons) {
      const name = parseIconName(icon)
      if (name) {
        names.add(name)
      }
    }
  }

  return [...names]
}

/** Load the SVG data for every requested icon from its locally-installed collection. */
export async function loadIconsData(names: string[], cwd: string): Promise<Record<string, IconData>> {
  const byCollection = new Map<string, Set<string>>()
  for (const fullName of names) {
    const colon = fullName.indexOf(':')
    const collection = fullName.slice(0, colon)

    let iconNames = byCollection.get(collection)
    if (!iconNames) {
      byCollection.set(collection, iconNames = new Set())
    }
    iconNames.add(fullName.slice(colon + 1))
  }

  const data: Record<string, IconData> = {}
  for (const [collection, iconNames] of byCollection) {
    // `loadCollectionFromFS` resolves `@iconify-json/<collection>` from `cwd` and falls
    // back to the full `@iconify/json` package, so it loads from wherever the collection
    // is installed in the project (or workspace) — never `process.cwd()`.
    const iconSet = await loadCollectionFromFS(collection, false, '@iconify-json', cwd)
    if (!iconSet) {
      continue
    }

    for (const name of iconNames) {
      const icon = getIconData(iconSet, name)
      if (icon) {
        data[`${collection}:${name}`] = icon
      }
    }
  }

  return data
}

/**
 * Names of the collections installed as `@iconify-json/<collection>` under any of `dirs`
 * (walking up `node_modules`). The scan is scoped to these, both because only installed
 * collections can be bundled and because it keeps the match regex precise.
 */
function getInstalledCollections(dirs: string[]): string[] {
  const collections = new Set<string>()

  for (const dir of dirs) {
    let current = dir
    while (true) {
      const scope = join(current, 'node_modules', '@iconify-json')
      if (existsSync(scope)) {
        for (const entry of readdirSync(scope, { withFileTypes: true })) {
          if (!entry.name.startsWith('.') && (entry.isDirectory() || entry.isSymbolicLink())) {
            collections.add(entry.name)
          }
        }
      }
      const parent = dirname(current)
      if (parent === current) {
        break
      }
      current = parent
    }
  }

  return [...collections]
}

/**
 * Match `i-{collection}-{name}`, `{collection}-{name}` and `{collection}:{name}` for known
 * collections only. Collections are sorted longest-first so multi-word names (e.g.
 * `material-symbols`) win over any shorter prefix — the same approach as `@nuxt/icon`.
 */
function createMatchRegex(collections: string[]): RegExp {
  const alternation = [...collections].sort((a, b) => b.length - a.length).join('|')
  return new RegExp(`\\b(?:i-)?(${alternation})[:-]([a-z0-9-]+)\\b`, 'g')
}

/** Extract every `{collection}:{name}` icon usage from a chunk of source code. */
function extractUsedIcons(code: string, regex: RegExp): string[] {
  return [...code.matchAll(regex)].map(match => `${match[1]}:${match[2]}`)
}

/**
 * Scan the project source for icon usages and return their `{collection}:{name}` names, so
 * icons used in the consumer's own components are bundled too (mirrors `@nuxt/icon`'s
 * `clientBundle.scan`). Reads files from disk rather than the module graph so it doesn't
 * depend on what Vite has transformed when the virtual module is first loaded.
 */
async function scanUsedIcons(root: string, scan: ScanOptions, collections: string[]): Promise<string[]> {
  if (!collections.length) {
    return []
  }

  const { globInclude = SCAN_GLOB_INCLUDE, globExclude = SCAN_GLOB_EXCLUDE } = typeof scan === 'object' ? scan : {}
  const regex = createMatchRegex(collections)
  const files = await glob(globInclude, { cwd: root, ignore: globExclude, absolute: true, expandDirectories: false })

  const names = new Set<string>()
  await Promise.all(files.map(async (file) => {
    const code = await readFile(file, 'utf8').catch(() => '')
    for (const name of extractUsedIcons(code, regex)) {
      names.add(name)
    }
  }))

  return [...names]
}

/**
 * Embed the icons Nuxt UI uses into the build so they render synchronously during SSR and
 * fully offline, instead of being fetched from the Iconify API at runtime.
 *
 * The generated `virtual:nuxt-ui-icons` module exports only the inlined icon data, with no
 * imports of its own: a virtual module has no location on disk to resolve a bare specifier
 * like `@iconify/vue` from, so the `addIcon` registration lives in the runtime plugin
 * `runtime/vue/plugins/icons`, which `PluginsPlugin` includes. That plugin imports the data
 * from here and `@iconify/vue` from its own location (the same instance the components use,
 * so the in-memory store is shared), and its install runs on both server and client.
 */
export default function IconsPlugin(options: NuxtUIOptions, appConfig: Record<string, any>) {
  // `config.root` is the Vite equivalent of Nuxt's `rootDir`; resolving from it (not
  // `process.cwd()`) is what keeps workspace/monorepo builds working (nuxt/icon#502).
  let root = options.root || process.cwd()
  let source: Promise<string> | undefined

  async function generate(): Promise<string> {
    if (options.icon?.clientBundle === false) {
      return 'export const icons = {}'
    }

    const names = new Set(resolveBundleNames(options, appConfig))

    const scan = options.icon?.clientBundle?.scan
    if (scan) {
      for (const name of await scanUsedIcons(root, scan, getInstalledCollections([root]))) {
        names.add(name)
      }
    }

    const data = await loadIconsData([...names], root)

    return `export const icons = ${JSON.stringify(data)}`
  }

  return {
    name: 'nuxt:ui:icons',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return VIRTUAL_ID
      }
    },
    loadInclude: id => id === VIRTUAL_ID,
    load() {
      source ||= generate()
      return source
    },
    vite: {
      configResolved(config) {
        root = options.root || config.root || root
      }
    }
  } satisfies UnpluginOptions
}
