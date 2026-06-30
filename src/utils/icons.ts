import defaultIcons from '../theme/icons'

const ICON_PREFIX = 'i-'

/**
 * Convert a Nuxt UI icon class (`i-{collection}-{name}`) into the `{collection}:{name}`
 * form expected by `@nuxt/icon`'s `clientBundle.icons`, treating the first dash-delimited
 * segment as the collection.
 *
 * This is only unambiguous for single-word collections (e.g. `lucide`); multi-word ones
 * (e.g. `material-symbols`) can't be split without `@nuxt/icon`'s collection list, so the
 * caller is responsible for restricting input to collections known to be single-word.
 */
function toBundleName(icon: unknown): string | undefined {
  if (typeof icon !== 'string' || !icon.startsWith(ICON_PREFIX)) {
    return
  }

  const id = icon.slice(ICON_PREFIX.length)
  const dash = id.indexOf('-')
  if (dash < 1 || dash === id.length - 1) {
    return
  }

  return `${id.slice(0, dash)}:${id.slice(dash + 1)}`
}

// Collections Nuxt UI ships its default icons in (currently just `lucide`). We only
// auto-bundle icons from these collections because they convert unambiguously; icons
// from other collections may use multi-word collection names that can't be split
// reliably, so they're left to runtime loading rather than emit a wrong name `@nuxt/icon`
// would drop and warn about. Derived from the defaults so it stays correct if they ever change.
const trustedCollections = new Set(
  Object.values(defaultIcons)
    .map(icon => toBundleName(icon)?.split(':')[0])
    .filter(Boolean) as string[]
)

/**
 * Normalize a user-provided icon into a `{collection}:{name}` bundle name.
 *
 * Unlike {@link toBundleName} (which only handles Nuxt UI's own `i-{collection}-{name}`
 * defaults), this accepts the forms a user might list in `icon.clientBundle.icons`:
 * with or without the `i-` prefix, and either dash- or colon-separated. The colon form
 * (`material-symbols:menu`) is the only way to bundle a multi-word collection, since a
 * dashed name can't be split into collection and icon without `@nuxt/icon`'s collection
 * list — matching how `@iconify/vue` expects multi-word collections to be written.
 */
export function parseIconName(icon: unknown): string | undefined {
  if (typeof icon !== 'string') {
    return
  }

  const id = icon.startsWith(ICON_PREFIX) ? icon.slice(ICON_PREFIX.length) : icon

  const colon = id.indexOf(':')
  if (colon > 0) {
    return colon < id.length - 1 ? id : undefined
  }

  const dash = id.indexOf('-')
  if (dash < 1 || dash === id.length - 1) {
    return
  }

  return `${id.slice(0, dash)}:${id.slice(dash + 1)}`
}

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
    const name = toBundleName(icon)
    if (!name) {
      continue
    }

    const collection = name.slice(0, name.indexOf(':'))
    if (trustedCollections.has(collection)) {
      names.add(name)
    }
  }

  return [...names]
}
