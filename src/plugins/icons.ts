import type { UnpluginOptions } from 'unplugin'
import { getIconData } from '@iconify/utils'
import { loadCollectionFromFS } from '@iconify/utils/lib/loader/fs'
import { getClientBundleIcons, parseIconName } from '../utils/icons'
import type { NuxtUIOptions } from '../unplugin'

const VIRTUAL_ID = 'virtual:nuxt-ui-icons'

type IconData = NonNullable<ReturnType<typeof getIconData>>

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

    const data = await loadIconsData(resolveBundleNames(options, appConfig), root)

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
