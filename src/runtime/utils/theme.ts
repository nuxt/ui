import type { DefinedTheme, TVTheme, TVThemeCheck } from '../types/tv'

/**
 * Declare a component theme. Checks its `compoundVariants` and `defaultVariants`
 * against its `variants`, and keeps their values literal, which inference alone
 * widens to `string`, so the theme can be passed to `tv()` as is.
 */
export function defineTheme<T extends TVTheme>(theme: T & TVThemeCheck<T>): DefinedTheme<T> {
  return theme as DefinedTheme<T>
}

/**
 * A theme extended by another: objects merge, an empty value keeps the base's
 * and a function is called with the base value, its classes as one string. Classes the extension adds to
 * the base's keep the extension's type, which is all the slot and variant names
 * need.
 */
export type ExtendedTheme<T, B>
  = [T] extends ['' | false | null | undefined]
    ? [B] extends [undefined] ? T : B
    : T extends (...args: any[]) => infer R
      ? R
      : T extends readonly any[]
        ? B extends readonly any[] ? Array<ExtendedTheme<T[number], undefined> | B[number]> : Array<ExtendedTheme<T[number], undefined>>
        : T extends Record<string, any>
          ? B extends Record<string, any>
            ? { [K in keyof T | keyof B]: K extends keyof T ? K extends keyof B ? ExtendedTheme<T[K], B[K]> : ExtendedTheme<T[K], undefined> : K extends keyof B ? B[K] : never }
            : { [K in keyof T]: ExtendedTheme<T[K], undefined> }
          : T

/**
 * Declare a theme that extends another, like Textarea extends Input. Its slot
 * and variant classes are added to the base's, the way `app.config.ui` adds
 * them, and a function replaces them, receiving the base's. Its
 * `compoundVariants` apply after the base's and its `defaultVariants` win.
 * @example extendTheme(card, { slots: { value: 'text-2xl font-semibold' } })
 */
export function extendTheme<B extends TVTheme, const T extends Record<string, any>>(base: B, theme: T): DefinedTheme<ExtendedTheme<T, B>> {
  const { slots, variants, compoundVariants, defaultVariants, ...rest } = theme
  return {
    ...base,
    ...rest,
    slots: mergeClasses(slots ?? {}, base.slots),
    variants: mergeClasses(variants ?? {}, base.variants),
    compoundVariants: [...(base.compoundVariants ?? []), ...(compoundVariants ?? [])],
    defaultVariants: { ...base.defaultVariants, ...defaultVariants }
  } as DefinedTheme<ExtendedTheme<T, B>>
}

/** Classes merged the way `app.config.ui` merges them: added to the base's, or replaced by a function. */
function mergeClasses(value: unknown, base: unknown): unknown {
  if (typeof value === 'function') {
    // Classes reach a replacer as one string, like in `app.config.ui`, also when the base has none or a previous
    // extension made them an array. A variant's object of slots is passed as is.
    return value(base && typeof base === 'object' && !Array.isArray(base) ? base : joinClasses(base))
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const merged: Record<string, unknown> = { ...(base && typeof base === 'object' && !Array.isArray(base) ? base : {}) }
    for (const key in value) {
      merged[key] = mergeClasses((value as Record<string, unknown>)[key], merged[key])
    }
    return merged
  }
  // An empty value, like a `false: ''` variant, keeps the base's classes
  if (value === '' || value === false || value == null) {
    return base ?? value
  }
  return base === undefined || base === '' ? value : [base, value]
}

function joinClasses(value: unknown): string {
  return Array.isArray(value) ? value.map(joinClasses).filter(Boolean).join(' ') : typeof value === 'string' ? value : ''
}
