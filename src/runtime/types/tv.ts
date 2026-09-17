import type { extendTailwindMerge } from 'tailwind-merge'

/**
 * The types the variants engine in `../utils/tv` resolves through, and the ones
 * `app.config.ui` and `ComponentConfig` are derived from.
 *
 * Inference is the half the snapshot suite can't prove, since it breaks in
 * user-land (`app.config.ui` autocomplete, component prop types) rather than in
 * CI, so `test/utils/tv-types.spec.ts` asserts the contract.
 */

type MergeConfig = Parameters<typeof extendTailwindMerge>[0]

/** The nested `extend` object, which is also accepted flattened at the top level. */
type MergeConfigExtension = Extract<MergeConfig, { extend?: unknown }>['extend']

/**
 * The `tailwind-merge` configuration, in either its nested or flattened shape.
 */
export type TWMergeConfig = MergeConfig & MergeConfigExtension

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

/**
 * Anything accepted where classes are expected: a string, a nested array with
 * falsy holes, or nothing. Clsx-style objects resolve at runtime but stay out of
 * the type so a misplaced object is caught rather than silently joined.
 */
export type ClassValue = string | 0 | 0n | false | null | undefined | readonly ClassValue[]

/**
 * A component's slots, or `undefined` for a theme that only has a `base`.
 */
export type TVSlots = Record<string, ClassValue> | undefined

/**
 * `class` and `className` are interchangeable, and both apply when passed together.
 */
export type ClassProp<T = ClassValue> = {
  class?: T
  className?: T
}

/**
 * A function form for a slot class that **replaces** the slot's default classes
 * instead of merging onto them, returning the classes to use in their place.
 * In `app.config.ui` it receives the slot's own theme classes and replaces only
 * those — `variants` and `compoundVariants` still apply on top. In `:ui` / `class`
 * it runs after variant resolution, so it receives the fully resolved class
 * string and replaces it, keeping only the plain classes passed alongside the
 * replacer (e.g. `[() => 'text-xl', 'opacity-50']` resolves to both).
 * @example title: defaults => 'text-xl font-bold'
 */
export type SlotClassReplacer = (defaults: string) => ClassValue

/**
 * A call-time class value, where a replacer may sit at any depth: components
 * forward `[props.ui?.<slot>, props.class]` straight into a slot function.
 */
export type SlotClassValue = ClassValue | SlotClassReplacer | readonly SlotClassValue[]

/** Variant values spelled `'true'` / `'false'` are read as booleans. */
type VariantKey<T> = T extends 'true' | 'false' ? boolean : T

/** The slots a class value can target: the theme's own, plus `base` when it has one. */
type SlotName<S extends TVSlots, B extends ClassValue> = B extends undefined ? keyof S : keyof S | 'base'

/** Classes for the whole component, or per slot. */
type SlotsClass<S extends TVSlots, B extends ClassValue> = ClassValue | { [K in SlotName<S, B>]?: ClassValue }

/** One variant group: every value it accepts, and the classes each contributes. */
type VariantGroup<S extends TVSlots, B extends ClassValue> = Record<string, SlotsClass<S, B>>

/**
 * Variant groups declared by the theme itself. A slotless theme resolves to `{}`,
 * which every object satisfies, so variants stay open there.
 */
type OwnVariants<S extends TVSlots, B extends ClassValue> = S extends undefined ? {} : Record<string, VariantGroup<S, B>>

/**
 * The `variants` object. When extending, the extended theme's own groups are
 * offered as-is so their values keep autocompleting, and new groups can be added
 * alongside.
 */
export type TVVariants<S extends TVSlots, B extends ClassValue = undefined, EV = undefined> = EV extends undefined
  ? OwnVariants<S, B>
  : | { [K in keyof EV]: { [Value in keyof EV[K]]: SlotsClass<S, B> } }
    | OwnVariants<S, B>

/** The values one variant accepts, from this theme or the one it extends. */
type VariantValue<V, EV, K>
  = | (K extends keyof V ? VariantKey<keyof V[K]> : never)
    | (K extends keyof EV ? VariantKey<keyof EV[K]> : never)

/**
 * `compoundVariants` entries, which match one value or any of several.
 */
export type TVCompoundVariants<V, S extends TVSlots, B extends ClassValue, EV = undefined> = Array<
  {
    [K in keyof V | keyof EV]?: VariantValue<V, EV, K> | VariantValue<V, EV, K>[]
  } & ClassProp<SlotsClass<S, B>>
>

/**
 * `defaultVariants`, the value each variant falls back to.
 */
export type TVDefaultVariants<V, EV = undefined> = {
  [K in keyof V | keyof EV]?: VariantValue<V, EV, K>
}

/**
 * The props a built component and its slot functions accept: the declared
 * variants, plus classes to merge on top.
 *
 * Undeclared keys are allowed, because `app.config.ui.<c>.variants` can add
 * variants the theme itself never declared and the engine ignores a prop no
 * variant reads. Closing that is gated on deciding whether app config may
 * introduce variants at all, not on this type.
 */
export type TVProps<V, EV = undefined> = {
  [K in keyof V | keyof EV]?: VariantValue<V, EV, K>
} & ClassProp<SlotClassValue> & { [key: string]: unknown }

/**
 * The metadata `extend` reads, whether it points at a plain theme object or at a
 * built component.
 */
export type TVExtend = {
  base?: any
  slots?: any
  variants?: any
  compoundVariants?: any
  defaultVariants?: any
}

type Slotted<S extends TVSlots> = S extends undefined ? {} : S

type BaseSlot<B extends ClassValue> = B extends undefined ? never : 'base'

type HasSlots<S extends TVSlots, ES extends TVSlots> = S extends undefined
  ? ES extends undefined ? false : true
  : true

/**
 * One function per slot: the extended theme's, this theme's own, and `base`.
 */
type TVSlotFunctions<V, S extends TVSlots, B extends ClassValue, EV, ES extends TVSlots> = {
  [K in keyof Slotted<S> | keyof Slotted<ES> | BaseSlot<B>]: (slotProps?: TVProps<V, EV>) => string
}

/**
 * A built component: callable with variant props, returning one class string when
 * the theme has no slots and a function per slot when it does. The metadata it
 * carries alongside is what `extend` resolves against.
 */
export type TVReturnType<
  V,
  S extends TVSlots,
  B extends ClassValue,
  EV = undefined,
  ES extends TVSlots = undefined,
  E = undefined
> = {
  (props?: TVProps<V, EV>): HasSlots<S, ES> extends true ? TVSlotFunctions<V, S, B, EV, ES> : string
  extend: E
  base: B
  slots: S
  variants: V
  compoundVariants: TVCompoundVariants<V, S, B, EV>
  defaultVariants: TVDefaultVariants<V, EV>
  variantKeys: (keyof V)[]
}

/**
 * The engine itself: a theme in, a built component out.
 */
export type TV = {
  <
    V extends TVVariants<S, B, EV>,
    CV extends TVCompoundVariants<V, S, B, EV>,
    DV extends TVDefaultVariants<V, EV>,
    B extends ClassValue = undefined,
    S extends TVSlots = undefined,
    E extends TVExtend | undefined = undefined,
    EV = E extends TVExtend ? E['variants'] : undefined,
    ES extends TVSlots = E extends TVExtend ? (E['slots'] extends TVSlots ? E['slots'] : undefined) : undefined
  >(
    options: {
      extend?: E
      base?: B
      slots?: S
      variants?: V
      compoundVariants?: CV
      defaultVariants?: DV
    },
    config?: TVMergeConfig
  ): TVReturnType<V, S, B, EV, ES, E>
}

/**
 * The value accepted for a slot in `:ui`, the `class` prop or `app.config.ui`:
 * either classes to merge (the default) or a {@link SlotClassReplacer} to replace.
 */
export type SlotClass = ClassValue | SlotClassReplacer

/**
 * Defines the AppConfig object based on the theme configuration.
 */
export type TVConfig<T extends Record<string, any>> = {
  [P in keyof T]?: P extends 'prose' ? TVConfig<T[P]> : {
    [K in keyof T[P]as K extends 'base' | 'slots' | 'variants' | 'defaultVariants' ? K : never]?: K extends 'base' ? SlotClass
      : K extends 'slots' ? {
        [S in keyof T[P]['slots']]?: SlotClass
      }
        : K extends 'variants' ? TVVariants<T[P]['slots'], ClassValue, WidenVariantsValues<T[P]['variants']>>
          : K extends 'defaultVariants' ? TVDefaultVariants<WidenVariantsValues<T[P]['variants']>, object>
            : never
  }
} & {
  [P in keyof T]?: P extends 'prose' ? TVConfig<T[P]> : {
    compoundVariants?: TVCompoundVariants<WidenVariantsValues<T[P]['variants']>, T[P]['slots'], ClassValue, object>
  }
}

type WidenVariantsValues<V extends Record<string, any> | undefined>
  = V extends Record<string, any> ? V & {
    [K in keyof V]: V[K] extends Record<string, any>
      ? V[K] & Record<string & {}, any>
      : V[K]
  } : V

/**
 * Utility type to flatten intersection types for better IDE hover information.
 * @template T The type to flatten.
 */
type Id<T> = {} & { [P in keyof T]: T[P] }

type ComponentVariants<T extends { variants?: Record<string, Record<string, any>> }> = {
  [K in keyof T['variants']]: keyof T['variants'][K]
}

type ComponentSlots<T extends { slots?: Record<string, any> }> = Id<{
  [K in keyof T['slots']]?: SlotClass
}>

type ComponentUI<T extends { slots?: Record<string, any> }> = Id<{
  [K in keyof Required<T['slots']>]: (props?: Record<string, any>) => string
}>

type GetComponentAppConfig<A, U extends string, K extends string>
  = A extends Record<U, Record<K, any>> ? A[U][K] : {}

type ComponentAppConfig<
  T,
  A extends Record<string, any>,
  K extends string,
  U extends string = 'ui' | 'ui.prose'
> = Omit<A, 'ui'> & {
  ui: U extends 'ui.prose'
    ? (A extends { ui: infer UI } ? Omit<UI, 'prose'> : Record<string, never>) & {
      prose?: (A extends { ui: { prose?: infer P } } ? Omit<NonNullable<P>, K> : Record<string, never>) & {
        [k in K]?: Partial<T>
      }
    }
    : (A extends { ui: infer UI } ? Omit<UI, K> : Record<string, never>) & {
      [k in K]?: Partial<T>
    }
}

/**
 * Defines the configuration shape expected for a component.
 * @template T The component's theme imported from `#build/ui/*`.
 * @template A The base AppConfig type from `@nuxt/schema`.
 * @template K The key identifying the component (e.g., 'badge').
 * @template U The top-level key in AppConfig ('ui' or 'uiPro').
 */
export type ComponentConfig<
  T extends Record<string, any>,
  A extends Record<string, any>,
  K extends string,
  U extends 'ui' | 'ui.prose' = 'ui'
> = {
  AppConfig: ComponentAppConfig<T, A, K, U>
  variants: ComponentVariants<T & GetComponentAppConfig<A, U, K>>
  slots: ComponentSlots<T>
  ui: ComponentUI<T>
}
