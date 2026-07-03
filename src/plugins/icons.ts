import { readFile } from 'node:fs/promises'
import { consola } from 'consola'
import { glob } from 'tinyglobby'
import type { UnpluginOptions } from 'unplugin'
import { IconUsageScanner, collectionNames, generateClientBundleCode, resolveBundleIcons } from '@nuxt/icon/utils'
import { getClientBundleIcons } from '../utils/icons'
import type { NuxtUIOptions } from '../unplugin'

const VIRTUAL_ID = 'virtual:nuxt-ui-icons'
// Cap concurrent file reads during the scan so large workspaces don't exhaust file
// descriptors (`EMFILE`) — `@nuxt/icon`'s own `scanFiles` reads them all at once.
const SCAN_CONCURRENCY = 20

// `@nuxt/icon`'s known collections, longest-first, so multi-word names (e.g. `material-symbols`)
// win over a shorter prefix when splitting a dashed icon.
const knownCollections = [...collectionNames].sort((a, b) => b.length - a.length)

/**
 * Normalize a user-provided icon (from `icon.clientBundle.icons`) into `{collection}:{name}`.
 * The colon form is unambiguous for any collection; for the dashed form we match against the
 * known collection list (longest-first) so multi-word collections like `material-symbols` split
 * correctly instead of mis-splitting on the first dash (which would then hard-fail the build).
 */
function parseUserIcon(icon: string): string | undefined {
  const id = icon.replace(/^i[-:]/, '')

  const colon = id.indexOf(':')
  if (colon > 0) {
    return colon < id.length - 1 ? id : undefined
  }

  const collection = knownCollections.find(name => id.startsWith(`${name}-`) && id.length > name.length + 1)
  if (collection) {
    return `${collection}:${id.slice(collection.length + 1)}`
  }

  // Unknown collection: best-effort split on the first dash.
  const dash = id.indexOf('-')
  return dash > 0 && dash < id.length - 1 ? `${id.slice(0, dash)}:${id.slice(dash + 1)}` : undefined
}

/**
 * Scan the project source for icon usages, reusing `@nuxt/icon`'s globs and matcher but
 * reading files in bounded batches to avoid `EMFILE` on large workspaces.
 */
async function scanUsedIcons(scanner: IconUsageScanner, root: string): Promise<Set<string>> {
  const files = await glob(scanner.globInclude, { cwd: root, ignore: scanner.globExclude, absolute: true, expandDirectories: false })

  const names = new Set<string>()
  for (let i = 0; i < files.length; i += SCAN_CONCURRENCY) {
    await Promise.all(files.slice(i, i + SCAN_CONCURRENCY).map(async (file) => {
      const code = await readFile(file, 'utf8').catch(() => '')
      scanner.extractFromCode(code, names)
    }))
  }

  return names
}

/**
 * Embed the icons Nuxt UI uses into the build so they render synchronously during SSR and
 * fully offline, instead of being fetched from the Iconify API at runtime.
 *
 * The resolving from installed `@iconify-json/*` packages and code generation are delegated to
 * `@nuxt/icon/utils` — the canonical implementation (nuxt/icon#506) — so we don't duplicate it.
 * This plugin only feeds Nuxt UI's own defaults into it:
 *
 * - Nuxt UI's defaults go through `extraIcons`, so a missing collection degrades to runtime
 *   loading rather than failing the build (Nuxt UI hard-depends on no collection).
 * - The user's `clientBundle.icons` go through `icons` (an unresolved one is a hard error, as
 *   in `@nuxt/icon`), and `clientBundle.scan` discovers icons used in their own source.
 *
 * The generated `virtual:nuxt-ui-icons` exports `init(addIcon)`; the runtime plugin
 * `runtime/vue/plugins/icons` calls it with `@iconify/vue`'s `addIcon` on both server and
 * client, which is what makes the bundled icons available during SSR.
 */
export default function IconsPlugin(options: NuxtUIOptions, appConfig: Record<string, any>) {
  // `config.root` is the Vite equivalent of Nuxt's `rootDir`; resolving from it (not
  // `process.cwd()`) is what keeps workspace/monorepo builds working (nuxt/icon#502).
  let root = options.root || process.cwd()
  let isBuild = false
  let source: Promise<string> | undefined

  async function generate(): Promise<string> {
    const clientBundle = options.icon?.clientBundle
    if (clientBundle === false) {
      return 'export function init() {}'
    }

    const icons = (clientBundle?.icons ?? [])
      .map(icon => parseUserIcon(icon))
      .filter((name): name is string => !!name)

    let scannedIcons: Set<string> | undefined
    if (clientBundle?.scan) {
      scannedIcons = await scanUsedIcons(new IconUsageScanner(clientBundle.scan), root)
    }

    const { collections, failed } = await resolveBundleIcons({
      icons,
      scannedIcons,
      extraIcons: getClientBundleIcons(appConfig.ui?.icons),
      resolvePaths: [root]
    })

    if (failed.length) {
      // Like `@nuxt/icon`: an unresolved explicitly-listed icon is a build error, but only a
      // warning in dev, so a typo doesn't crash the dev server (it falls back to runtime there).
      const message = `[Nuxt UI] Could not resolve the icons requested in \`icon.clientBundle.icons\`: ${failed.join(', ')}. Install their \`@iconify-json/*\` collection, or remove them.`
      if (isBuild) {
        throw new Error(message)
      }
      consola.warn(message)
    }

    return generateClientBundleCode(collections, { sizeLimitKb: clientBundle?.sizeLimitKb }).code
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
        isBuild = config.command === 'build'
      }
    }
  } satisfies UnpluginOptions
}
