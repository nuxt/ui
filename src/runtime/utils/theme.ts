import { defuFn } from 'defu'
import type { DefinedTheme, TVTheme, TVThemeCheck } from '../types/tv'

/**
 * Declare a component theme. Checks its `compoundVariants` and `defaultVariants`
 * against its `variants`, and keeps their values literal, which inference alone
 * widens to `string`, so the theme can be passed to `tv()` as is.
 * @internal
 */
export function defineTheme<T extends TVTheme>(theme: T & TVThemeCheck<T>): DefinedTheme<T> {
  return theme as DefinedTheme<T>
}

/**
 * A theme extended by another, typed after `defuFn`: objects merge, arrays
 * concatenate with the extension's items first, and any other value the
 * extension sets wins, a function being called with the base value. With no
 * base value the function is kept as is, which `tv()` then rejects.
 */
export type ExtendedTheme<T, B>
  = T extends (...args: any[]) => infer R
    ? B extends undefined ? T : R
    : T extends readonly any[]
      ? B extends readonly any[] ? Array<ExtendedTheme<T[number], undefined> | B[number]> : Array<ExtendedTheme<T[number], undefined>>
      : T extends Record<string, any>
        ? B extends Record<string, any>
          ? { [K in keyof T | keyof B]: K extends keyof T ? K extends keyof B ? ExtendedTheme<T[K], B[K]> : ExtendedTheme<T[K], undefined> : K extends keyof B ? B[K] : never }
          : { [K in keyof T]: ExtendedTheme<T[K], undefined> }
        : T

/**
 * Declare a theme that extends another, like Select extends Input. The
 * extension's values win, a function receives the base value and returns the
 * new one, and `compoundVariants` concatenate.
 * @internal
 */
export function extendTheme<B extends TVTheme, const T extends Record<string, any>>(base: B, theme: T): DefinedTheme<ExtendedTheme<T, B>> {
  return defuFn(theme, base) as DefinedTheme<ExtendedTheme<T, B>>
}

type RenamedKey<O, From extends string, To extends string> = O extends Record<string, any>
  ? { [K in keyof O as K extends From ? To : K]: O[K] }
  : O

type RenamedCompound<C, From extends string, To extends string> = C extends { class: infer K }
  ? Omit<C, 'class'> & { class: RenamedKey<K, From, To> }
  : C

/**
 * A theme with one of its slots under another name, in its `slots`, its
 * `variants` and the classes of its `compoundVariants`.
 */
export type RenamedSlot<T, From extends string, To extends string> = {
  [K in keyof T]: K extends 'slots'
    ? RenamedKey<T[K], From, To>
    : K extends 'variants'
      ? { [V in keyof T[K]]: { [O in keyof T[K][V]]: RenamedKey<T[K][V][O], From, To> } }
      : K extends 'compoundVariants'
        ? T[K] extends ReadonlyArray<infer C> ? Array<RenamedCompound<C, From, To>> : T[K]
        : T[K]
}

/**
 * Give a slot of a theme another name, like the box of the field theme, which
 * is `base` on a Select and `root` on an InputDate.
 * @internal
 */
export function renameSlot<T extends TVTheme, From extends string, To extends string>(theme: T, from: From, to: To): RenamedSlot<T, From, To> {
  const rename = (value: any) => value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key === from ? to : key, item]))
    : value
  const variants = (theme as any).variants as Record<string, Record<string, any>> | undefined
  const compoundVariants = (theme as any).compoundVariants as Array<Record<string, any>> | undefined

  return {
    ...theme,
    ...((theme as any).slots && { slots: rename((theme as any).slots) }),
    ...(variants && { variants: Object.fromEntries(Object.entries(variants).map(([name, options]) => [name, Object.fromEntries(Object.entries(options).map(([option, value]) => [option, rename(value)]))])) }),
    ...(compoundVariants && { compoundVariants: compoundVariants.map(item => ({ ...item, class: rename(item.class) })) })
  } as RenamedSlot<T, From, To>
}

/**
 * A theme without some of its variants, for a component that extends another
 * and has no use for them, like Textarea with the `type` of an Input.
 * @internal
 */
export function omitVariants<T extends TVTheme, K extends string>(theme: T, ...names: K[]): { [P in keyof T]: P extends 'variants' ? Omit<T[P], K> : T[P] } {
  const variants = Object.fromEntries(Object.entries((theme as any).variants || {}).filter(([name]) => !names.includes(name as K)))

  return { ...theme, variants } as any
}
