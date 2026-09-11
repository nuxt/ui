import atlas from '#build/ui-stylex-atlas'

type Atlas = Record<string, string[]>

const propsByHash = atlas as Atlas
const hasAtlas = Object.keys(propsByHash).length > 0
const mergeCache = new Map<string, string>()

/**
 * Last-in-wins per (state + property) for concatenated StyleX hashes.
 * Keys include at-rules and pseudos (`:hover`, `::before`) so
 * `before:absolute` does not drop `relative`, and `hover:text-*` does not
 * drop `text-muted`. Same-state collisions still merge (`p-1.5` over `px-2.5`).
 */
export function mergeStylexClasses(classes: string | undefined): string | undefined {
  if (!classes || !hasAtlas) {
    return classes
  }

  const cached = mergeCache.get(classes)
  if (cached !== undefined) {
    return cached
  }

  const tokens = classes.split(/\s+/).filter(Boolean)
  if (tokens.length < 2) {
    return classes
  }

  const byProp = new Map<string, string>()
  for (const token of tokens) {
    const props = propsByHash[token]
    if (!props?.length) {
      continue
    }
    for (const prop of props) {
      byProp.set(prop, token)
    }
  }

  const seen = new Set<string>()
  const out: string[] = []
  for (const token of tokens) {
    if (seen.has(token)) {
      continue
    }
    const props = propsByHash[token]
    if (props?.length && !props.some(prop => byProp.get(prop) === token)) {
      continue
    }
    seen.add(token)
    out.push(token)
  }

  const merged = out.join(' ')
  if (mergeCache.size >= 4000) {
    mergeCache.clear()
  }
  mergeCache.set(classes, merged)
  return merged
}
