/**
 * Prefix every utility in a class string for an app that sets Tailwind's
 * `prefix(...)`. A class already carrying the prefix is left as is.
 * @example prefixClasses('flex hover:bg-red-500', 'tw') // 'tw:flex tw:hover:bg-red-500'
 */
export function prefixClasses(classString: string, prefix?: string): string {
  if (!prefix || !classString) {
    return classString
  }

  const start = `${prefix}:`

  return classString
    .split(/\s+/)
    .filter(Boolean)
    .map(cls => cls.startsWith(start) ? cls : start + cls)
    .join(' ')
}

/**
 * Prefix a class value: a string, an array of them, or an object mapping slot
 * names to classes.
 */
function prefixValue(value: unknown, prefix: string): unknown {
  if (typeof value === 'string') {
    return prefixClasses(value, prefix)
  }
  if (Array.isArray(value)) {
    return value.map(item => prefixValue(item, prefix))
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, prefixValue(item, prefix)]))
  }
  return value
}

/**
 * Prefix every class in a theme. Mirrors `applyUnstyled`: classes live in
 * `slots`, in the `variants` values and in each `compoundVariants` entry's
 * `class`, while the variant values the compound entries match and
 * `defaultVariants` stay as they are.
 * @param theme - The theme object
 * @param prefix - The Tailwind prefix (e.g. `tw`)
 * @returns A prefixed copy of the theme
 */
export function applyPrefix(theme: any, prefix?: string): any {
  if (!theme || !prefix) {
    return theme
  }

  const result = { ...theme }

  if (result.slots) {
    result.slots = prefixValue(result.slots, prefix)
  }

  if (result.variants) {
    result.variants = Object.fromEntries(
      Object.entries(result.variants).map(([name, group]) => [name, prefixValue(group, prefix)])
    )
  }

  if (result.compoundVariants) {
    result.compoundVariants = result.compoundVariants.map((entry: Record<string, unknown>) => (
      Object.fromEntries(Object.entries(entry).map(([key, value]) => [key, key === 'class' ? prefixValue(value, prefix) : value]))
    ))
  }

  return result
}
