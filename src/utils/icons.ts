import defaultIcons from '../theme/icons'

/**
 * Split an icon (`i-{collection}-{name}`, `{collection}:{name}`, with or without the
 * `i-`/`i:` prefix) into `[collection, name]`.
 *
 * The colon form is unambiguous and accepted for any collection. The dashed form is
 * matched against `collections` longest-first, so multi-word collections (e.g.
 * `material-symbols`) split correctly instead of on the first dash. When `fallback`
 * is set, a dashed icon matching no collection is best-effort split on the first dash.
 *
 * This is the single parser for both the theme defaults (`getClientBundleIcons`) and
 * the user's `icon.clientBundle.icons`, so the two paths can't drift apart.
 */
export function parseIconName(icon: string, collections: Iterable<string> = [], fallback = false): [collection: string, name: string] | undefined {
  const id = icon.replace(/^i[-:]/, '')

  const colon = id.indexOf(':')
  if (colon !== -1) {
    return colon > 0 && colon < id.length - 1 ? [id.slice(0, colon), id.slice(colon + 1)] : undefined
  }

  let collection: string | undefined
  for (const name of collections) {
    if (id.startsWith(`${name}-`) && id.length > name.length + 1 && name.length > (collection?.length ?? 0)) {
      collection = name
    }
  }
  if (collection) {
    return [collection, id.slice(collection.length + 1)]
  }

  if (fallback) {
    const dash = id.indexOf('-')
    if (dash > 0 && dash < id.length - 1) {
      return [id.slice(0, dash), id.slice(dash + 1)]
    }
  }
}

// Collections Nuxt UI ships its default icons in (currently just `lucide`). We only
// auto-bundle icons from these collections because they convert unambiguously; icons
// from other collections may use multi-word collection names that can't be split
// reliably, so they're left to runtime loading rather than emit a wrong name `@nuxt/icon`
// would drop and warn about. Derived from the defaults (known to be single-word, hence
// the first-dash fallback) so it stays correct if they ever change.
const trustedCollections = new Set(
  Object.values(defaultIcons)
    .map(icon => parseIconName(icon, [], true)?.[0])
    .filter((collection): collection is string => !!collection)
)

/**
 * Resolve the icons Nuxt UI uses into `@nuxt/icon` client-bundle names so they're
 * embedded at build time instead of fetched at runtime.
 *
 * `@nuxt/icon`'s `clientBundle.scan` skips `node_modules`, so the icons baked into
 * Nuxt UI's components (chevrons, the loading spinner, close buttons, etc.) can't be
 * discovered on their own and would otherwise be loaded on demand on every page.
 *
 * Restricted to {@link trustedCollections} so multi-word collection names can't be
 * mis-split; any name `@nuxt/icon` still can't resolve (collection not installed, icon
 * missing) is dropped and falls back to runtime loading instead of failing the build.
 */
export function getClientBundleIcons(icons: Record<string, string> = {}): string[] {
  const names = new Set<string>()

  for (const icon of Object.values(icons)) {
    if (typeof icon !== 'string') {
      continue
    }

    const parsed = parseIconName(icon, trustedCollections)
    if (parsed && trustedCollections.has(parsed[0])) {
      names.add(`${parsed[0]}:${parsed[1]}`)
    }
  }

  return [...names]
}
