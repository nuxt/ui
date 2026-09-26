import { defuFn } from 'defu'
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
 */
export function extendTheme<B extends TVTheme, const T extends Record<string, any>>(base: B, theme: T): DefinedTheme<ExtendedTheme<T, B>> {
  return defuFn(theme, base) as DefinedTheme<ExtendedTheme<T, B>>
}
