import { applyPrefix } from '../runtime/utils/prefix'

/**
 * Every class the themes hold, prefixed the way the engine prefixes them at
 * runtime, for the `@source inline(...)` list of an app that sets Tailwind's
 * `prefix(...)`.
 * @param themes - The theme objects
 * @param prefix - The Tailwind prefix (e.g. `tw`)
 * @returns The sorted, deduplicated class list
 */
export function getThemeClasses(themes: Record<string, any>[], prefix: string): string[] {
  const classes = new Set<string>()

  const collect = (value: unknown): void => {
    if (typeof value === 'string') {
      for (const cls of value.split(/\s+/)) {
        if (cls) {
          classes.add(cls)
        }
      }
    } else if (Array.isArray(value)) {
      value.forEach(collect)
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(collect)
    }
  }

  for (const theme of themes) {
    const prefixed = applyPrefix(theme, prefix)

    collect(prefixed?.slots)
    Object.values(prefixed?.variants ?? {}).forEach(collect)
    prefixed?.compoundVariants?.forEach((entry: Record<string, unknown>) => collect(entry.class))
  }

  return [...classes].sort()
}

export { applyUnstyled } from '../runtime/utils/unstyled'
