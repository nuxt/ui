import type { extendTailwindMerge } from 'tailwind-merge'

/**
 * Type surface of the variants engine in `../utils/tv-engine`, ported from
 * `tailwind-variants` 3.2.2 so nothing about inference changes with the runtime.
 * Themes, `app.config.ui` autocomplete and every `ComponentConfig`-derived prop
 * type resolve through these shapes, and a widening or narrowing here surfaces
 * in user-land rather than in our test suite, so they stay structurally
 * identical to what they replace.
 */

type MergeConfig = Parameters<typeof extendTailwindMerge>[0]
type LegacyMergeConfig = Extract<MergeConfig, { extend?: unknown }>['extend']

/**
 * The `tailwind-merge` configuration, accepted both in its modern (`{ extend }`)
 * and legacy (flat `{ theme, classGroups, … }`) shapes.
 */
export type TWMergeConfig = MergeConfig & LegacyMergeConfig

/**
 * The engine configuration, set through `app.config.ui.tv`.
 */
export type TVMergeConfig = {
  /**
   * Whether to merge conflicting Tailwind classes through `tailwind-merge`.
   * @defaultValue true
   */
  twMerge?: boolean
  /**
   * The configuration handed to `tailwind-merge`.
   */
  twMergeConfig?: TWMergeConfig
}

type ClassArray = readonly ClassValue[]

/**
 * Any value accepted where classes are expected: a string, a (nested) array with
 * falsy holes, or nothing. Clsx-style objects resolve at runtime but stay out of
 * the type, as they did under `tailwind-variants`.
 */
export type ClassValue = ClassArray | string | null | undefined | 0 | 0n | false

export type ClassProp<V = ClassValue>
  = | { class?: V, className?: never }
    | { class?: never, className?: V }

type TVBaseName = 'base'

export type TVSlots = Record<string, ClassValue> | undefined

type StringToBoolean<T> = T extends 'true' | 'false' ? boolean : T

type TVSlotsWithBase<S extends TVSlots, B extends ClassValue> = B extends undefined
  ? keyof S
  : keyof S | TVBaseName

type SlotsClassValue<S extends TVSlots, B extends ClassValue> = {
  [K in TVSlotsWithBase<S, B>]?: ClassValue
}

type TVVariantsDefault<S extends TVSlots, B extends ClassValue> = S extends undefined
  ? {}
  : {
      [key: string]: {
        [key: string]: S extends TVSlots ? SlotsClassValue<S, B> | ClassValue : ClassValue
      }
    }

export type TVVariants<
  S extends TVSlots | undefined,
  B extends ClassValue | undefined = undefined,
  EV extends TVVariants<ES> | undefined = undefined,
  ES extends TVSlots | undefined = undefined
> = EV extends undefined
  ? TVVariantsDefault<S, B>
  : | {
    [K in keyof EV]: {
      [K2 in keyof EV[K]]: S extends TVSlots ? SlotsClassValue<S, B> | ClassValue : ClassValue
    }
  }
  | TVVariantsDefault<S, B>

export type TVCompoundVariants<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue,
  EV extends TVVariants<ES>,
  ES extends TVSlots
> = Array<
  {
    [K in keyof V | keyof EV]?:
      | (K extends keyof V ? StringToBoolean<keyof V[K]> : never)
      | (K extends keyof EV ? StringToBoolean<keyof EV[K]> : never)
      | (K extends keyof V ? StringToBoolean<keyof V[K]>[] : never)
  } & ClassProp<SlotsClassValue<S, B> | ClassValue>
>

export type TVCompoundSlots<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue
> = Array<
  V extends undefined
    ? { slots: Array<TVSlotsWithBase<S, B>> } & ClassProp
    : { slots: Array<TVSlotsWithBase<S, B>> } & {
      [K in keyof V]?: StringToBoolean<keyof V[K]> | StringToBoolean<keyof V[K]>[]
    } & ClassProp
>

export type TVDefaultVariants<
  V extends TVVariants<S>,
  S extends TVSlots,
  EV extends TVVariants<ES>,
  ES extends TVSlots
> = {
  [K in keyof V | keyof EV]?:
    | (K extends keyof V ? StringToBoolean<keyof V[K]> : never)
    | (K extends keyof EV ? StringToBoolean<keyof EV[K]> : never)
}

type VariantProps<V> = {
  [K in keyof V]?: StringToBoolean<keyof V[K]> | undefined
}

type MergedVariantProps<V, EV> = {
  [K in keyof V | keyof EV]?:
    | (K extends keyof V ? StringToBoolean<keyof V[K]> : never)
    | (K extends keyof EV ? StringToBoolean<keyof EV[K]> : never)
    | undefined
}

type TVProps<
  V extends TVVariants<S>,
  S extends TVSlots,
  EV extends TVVariants<ES>,
  ES extends TVSlots
> = EV extends undefined
  ? V extends undefined
    ? ClassProp<ClassValue>
    : VariantProps<V> & ClassProp<ClassValue>
  : V extends undefined
    ? VariantProps<EV> & ClassProp<ClassValue>
    : MergedVariantProps<V, EV> & ClassProp<ClassValue>

type TVVariantKeys<V extends TVVariants<S>, S extends TVSlots> = V extends object
  ? Array<keyof V>
  : undefined

/**
 * The metadata a built component carries, which is what `extend: theme` reads.
 */
type TVReturnProps<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue,
  EV extends TVVariants<ES>,
  ES extends TVSlots,
  // @ts-expect-error circular reference, resolved through the default below
  E extends TVReturnType = undefined
> = {
  extend: E
  base: B
  slots: S
  variants: V
  defaultVariants: TVDefaultVariants<V, S, EV, ES>
  compoundVariants: TVCompoundVariants<V, S, B, EV, ES>
  compoundSlots: TVCompoundSlots<V, S, B>
  variantKeys: TVVariantKeys<V, S>
}

type HasSlots<S extends TVSlots, ES extends TVSlots> = S extends undefined
  ? ES extends undefined
    ? false
    : true
  : true

/**
 * One function per slot, keyed by the extended theme's slots, this theme's own
 * slots and `base`.
 */
type TVSlotFunctions<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue,
  EV extends TVVariants<ES>,
  ES extends TVSlots
> = {
  [K in keyof (ES extends undefined ? {} : ES)]: (slotProps?: TVProps<V, S, EV, ES>) => string
} & {
  [K in keyof (S extends undefined ? {} : S)]: (slotProps?: TVProps<V, S, EV, ES>) => string
} & {
  [K in TVSlotsWithBase<{}, B>]: (slotProps?: TVProps<V, S, EV, ES>) => string
}

/**
 * A built component: callable with variant props, returning either one class
 * string (no slots) or a slot function per slot.
 */
export type TVReturnType<
  V extends TVVariants<S>,
  S extends TVSlots,
  B extends ClassValue,
  EV extends TVVariants<ES>,
  ES extends TVSlots,
  // @ts-expect-error circular reference, resolved through the default below
  E extends TVReturnType = undefined
> = {
  (props?: TVProps<V, S, EV, ES>): HasSlots<S, ES> extends true ? TVSlotFunctions<V, S, B, EV, ES> : string
} & TVReturnProps<V, S, B, EV, ES, E>
