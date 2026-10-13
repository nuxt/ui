import { consola } from 'consola'
import { relative } from 'pathe'
import type { UnpluginOptions } from 'unplugin'
import { IconUsageScanner, collectionNames, generateClientBundleCode, resolveBundleIcons } from '@nuxt/icon/utils'
import { getClientBundleIcons, parseIconName } from '../utils/icons'
import type { NuxtUIOptions } from '../unplugin'

const VIRTUAL_ID = 'virtual:nuxt-ui-icons'

/**
 * Normalize a user-provided icon (from `icon.clientBundle.icons`) into `{collection}:{name}`.
 * The colon form is unambiguous for any collection; for the dashed form we match against
 * `@nuxt/icon`'s known collection list so multi-word collections like `material-symbols` split
 * correctly, falling back to a first-dash split for collections the list doesn't know yet.
 */
function parseUserIcon(icon: string): string | undefined {
  const parsed = parseIconName(icon, collectionNames, true)
  return parsed ? `${parsed[0]}:${parsed[1]}` : undefined
}

/**
 * Embed the icons Nuxt UI uses into the build so they render synchronously during SSR and
 * fully offline, instead of being fetched from the Iconify API at runtime.
 *
 * The resolving from installed `@iconify-json/*` packages, the source scan and the code
 * generation are delegated to `@nuxt/icon/utils` — the canonical implementation
 * (nuxt/icon#506) — so we don't duplicate it. This plugin only feeds Nuxt UI's own
 * defaults into it:
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

  // Scan state lives outside `generate()` so `handleHotUpdate` can extend it incrementally:
  // the full file scan runs once, later edits only feed the changed file through the matcher.
  let scanner: IconUsageScanner | undefined
  let scanned = false
  const scannedIcons = new Set<string>()

  async function generate(): Promise<string> {
    const clientBundle = options.icon?.clientBundle
    if (clientBundle === false) {
      return 'export function init() {}'
    }

    // Map each name passed to `resolveBundleIcons` back to the user's input (keyed as it
    // comes back in `failed`, which strips a leading `i-`/`i:`), so errors name what the
    // user actually wrote. An unparseable entry is passed through as-is: `resolveBundleIcons`
    // rejects it into `failed`, keeping the hard-error contract for explicitly-listed icons.
    const userIcons = new Map<string, string>()
    for (const icon of clientBundle?.icons ?? []) {
      userIcons.set(parseUserIcon(icon) ?? icon.replace(/^i[-:]/, ''), icon)
    }

    if (clientBundle?.scan) {
      scanner ||= new IconUsageScanner(clientBundle.scan)
      if (!scanned) {
        await scanner.scanFiles(root, scannedIcons)
        scanned = true
      }
    }

    const { collections, failed } = await resolveBundleIcons({
      icons: userIcons.keys(),
      scannedIcons,
      extraIcons: getClientBundleIcons(appConfig.ui?.icons),
      resolvePaths: [root]
    })

    if (failed.length) {
      // Like `@nuxt/icon`: an unresolved explicitly-listed icon is a build error, but only a
      // warning in dev, so a typo doesn't crash the dev server (it falls back to runtime there).
      const names = failed.map(name => userIcons.get(name) ?? name)
      const message = `[Nuxt UI] Could not resolve the icons requested in \`icon.clientBundle.icons\`: ${names.join(', ')}. Install their \`@iconify-json/*\` collection, or remove them.`
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
      // A rejection (e.g. the size limit) is not memoized: the next load retries instead of
      // wedging every request on a stale error until the server restarts.
      source ||= generate().catch((error) => {
        source = undefined
        throw error
      })
      return source
    },
    vite: {
      configResolved(config) {
        root = options.root || config.root || root
        isBuild = config.command === 'build'
      },
      // Like `@nuxt/icon`'s vite plugin: when an edit introduces icons the scan hasn't seen,
      // regenerate the virtual module so `scan: true` doesn't go stale until a restart.
      async handleHotUpdate({ file, read, server }) {
        if (!scanner) {
          return
        }

        const path = relative(root, file)
        if (path.startsWith('..') || !scanner.isFileMatch(path)) {
          return
        }

        const sizeBefore = scannedIcons.size
        scanner.extractFromCode(await read(), scannedIcons)
        if (scannedIcons.size === sizeBefore) {
          return
        }

        source = undefined
        const mod = server.moduleGraph.getModuleById(VIRTUAL_ID)
        if (mod) {
          server.moduleGraph.invalidateModule(mod)
          await server.reloadModule(mod)
        }
      }
    }
  } satisfies UnpluginOptions
}
