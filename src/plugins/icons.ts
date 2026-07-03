import type { UnpluginOptions } from 'unplugin'
import { IconUsageScanner, generateClientBundleCode, resolveBundleIcons } from '@nuxt/icon/utils'
import { getClientBundleIcons, parseIconName } from '../utils/icons'
import type { NuxtUIOptions } from '../unplugin'

const VIRTUAL_ID = 'virtual:nuxt-ui-icons'

/**
 * Embed the icons Nuxt UI uses into the build so they render synchronously during SSR and
 * fully offline, instead of being fetched from the Iconify API at runtime.
 *
 * The scanning, resolving from installed `@iconify-json/*` packages, and code generation are
 * delegated to `@nuxt/icon/utils` — the canonical implementation (nuxt/icon#506) — so we
 * don't duplicate it. This plugin only feeds Nuxt UI's own defaults into it:
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
  let source: Promise<string> | undefined

  async function generate(): Promise<string> {
    const clientBundle = options.icon?.clientBundle
    if (clientBundle === false) {
      return 'export function init() {}'
    }

    const icons = (clientBundle?.icons ?? [])
      .map(icon => parseIconName(icon))
      .filter((name): name is string => !!name)

    let scannedIcons: Set<string> | undefined
    if (clientBundle?.scan) {
      scannedIcons = await new IconUsageScanner(clientBundle.scan).scanFiles(root)
    }

    const { collections, failed } = await resolveBundleIcons({
      icons,
      scannedIcons,
      extraIcons: getClientBundleIcons(appConfig.ui?.icons),
      resolvePaths: [root]
    })

    if (failed.length) {
      throw new Error(`[Nuxt UI] Could not resolve the icons requested in \`icon.clientBundle.icons\`: ${failed.join(', ')}. Install their \`@iconify-json/*\` collection, or remove them.`)
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
      }
    }
  } satisfies UnpluginOptions
}
