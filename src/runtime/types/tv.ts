import type { extendTailwindMerge } from 'tailwind-merge'

/**
 * The types the variants engine in `../utils/tv` resolves through, and the ones
 * `app.config.ui` and `ComponentConfig` are derived from.
 *
 * Inference is the half the snapshot suite can't prove, since it breaks in
 * user-land (`app.config.ui` autocomplete, component prop types) rather than in
 * CI, so the type block of `test/utils/tv.spec.ts` asserts the contract.
 */

type MergeConfig = Extract<Parameters<typeof extendTailwindMerge>[0], { extend?: unknown }>

/** The nested `extend` object, which is also accepted flattened at the top level. */
type MergeConfigExtension = MergeConfig['extend']

/**
 * The `tailwind-merge` configuration, in either its nested or flattened shape.
 */
export type TWMergeConfig = MergeConfig & MergeConfigExtension

/**
 * The engine configuration, set through `app.config.ui.tv`.
 */
export type TVMergeConfig = {
  /**
   * Whether to merge conflicting Tailwind classes.
   * @defaultValue true
   */
  merge?: boolean
  /**
   * The configuration handed to the merger.
   */
  mergeConfig?: TWMergeConfig
}

/**
 * Anything accepted where classes are expected: a string, a nested array with
 * falsy holes, or nothing. Clsx-style objects resolve at runtime but stay out of
 * the type so a misplaced object is caught rather than silently joined.
 */
export type ClassValue = string | 0 | 0n | false | null | undefined | readonly ClassValue[]

/**
 * A component's slots.
 */
export type TVSlots = Record<string, ClassValue>

/**
 * Classes to merge on top of a resolved chain.
 */
export type ClassProp<T = ClassValue> = {
  class?: T
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

/**
 * The value accepted for a slot in `:ui`, the `class` prop or `app.config.ui`:
 * either classes to merge (the default) or a {@link SlotClassReplacer} to replace.
 */
export type SlotClass = ClassValue | SlotClassReplacer

/**
 * Variant values spelled `'true'` / `'false'` are read as booleans, and a
 * numeric key (`2: {...}`) is matched by its string form as well.
 */
type VariantKey<T> = T extends 'true' | 'false' ? boolean : T extends number ? T | `${T}` : T

/** A variant value declared for its key alone, with no classes of its own. */
type NoClass = '' | false | null | undefined

/** Values a variant or compound entry may hold, kept literal by inference. */
type VariantPropValue = string | number | boolean | null | undefined

/**
 * A theme, the shape `src/runtime/theme/*` produces and `#build/ui/*` exports: classes
 * per slot, the variants that switch them, and what they default to.
 */
export type TVTheme = {
  slots?: TVSlots
  // `string` rather than `''`: a theme is inferred from a literal, where the
  // empty placeholder of a value that contributes nothing widens to `string`.
  variants?: Record<string, Record<string, string | NoClass | Record<string, ClassValue>>>
  compoundVariants?: Record<string, VariantPropValue | readonly VariantPropValue[] | Record<string, ClassValue>>[]
  defaultVariants?: Record<string, VariantPropValue>
}

/** The theme's variant groups, `{}` when it declares none. */
type VariantsOf<T> = T extends { variants?: infer V } ? NonNullable<V> extends Record<string, any> ? NonNullable<V> : {} : {}

/** The theme's slots, `{}` when it declares none. */
type SlotsOf<T> = T extends { slots?: infer S } ? NonNullable<S> extends Record<string, any> ? NonNullable<S> : {} : {}

/** The slots a class value can target. */
type SlotName<T> = keyof SlotsOf<T>

/** Classes per slot. A variant value that contributes nothing may stay empty. */
type SlotsClass<T> = NoClass | { [K in SlotName<T>]?: ClassValue }

/** One variant group: every value it accepts, and the classes each contributes. */
type VariantGroup<T> = Record<string, SlotsClass<T>>

/**
 * The `variants` object of an override: the theme's own groups and values keep
 * autocompleting, and new groups and values can be added alongside.
 */
export type TVVariants<T> = {
  [K in keyof VariantsOf<T>]?: { [Value in keyof VariantsOf<T>[K]]?: SlotsClass<T> } & VariantGroup<T>
} & Record<string, VariantGroup<T>>

/** The values one variant accepts. */
type VariantValue<T, K> = K extends keyof VariantsOf<T> ? VariantKey<keyof VariantsOf<T>[K]> : never

/**
 * `compoundVariants` entries, which match one value or any of several.
 */
export type TVCompoundVariants<T> = Array<
  {
    [K in keyof VariantsOf<T>]?: VariantValue<T, K> | VariantValue<T, K>[]
  } & ClassProp<SlotsClass<T>>
>

/**
 * `defaultVariants`, the value each variant falls back to.
 */
export type TVDefaultVariants<T> = {
  [K in keyof VariantsOf<T>]?: VariantValue<T, K>
}

/**
 * What `app.config.ui.<c>` may say on top of a theme: classes to merge or a
 * replacer per slot, and variants, compound variants and defaults that extend
 * the theme's own.
 */
export type TVOverrides<T> = {
  slots?: { [K in keyof SlotsOf<T>]?: SlotClass }
  variants?: TVVariants<T>
  compoundVariants?: TVCompoundVariants<T>
  defaultVariants?: TVDefaultVariants<T>
}

/**
 * The props a built component accepts: the theme's variants. Variants that
 * `app.config.ui.<c>` adds reach the component's own props through
 * `ComponentConfig`, so nothing needs to be open here.
 */
export type TVVariantProps<T> = {
  [K in keyof VariantsOf<T>]?: VariantValue<T, K>
}

/**
 * The props a slot function accepts: the variants, plus classes to merge on top.
 */
export type TVProps<T> = TVVariantProps<T> & ClassProp<SlotClassValue>

/**
 * The variant props of a built component.
 */
export type VariantProps<Component extends (...args: any) => any> = Exclude<Parameters<Component>[0], undefined>

/**
 * One function per slot.
 */
type TVSlotFunctions<T> = {
  [K in SlotName<T>]: (slotProps?: TVProps<T>) => string
}

/**
 * A built component: callable with variant props, returning a function per slot.
 * Classes go to the slot functions, the invocation takes none.
 */
export type TVReturnType<T> = (props?: TVVariantProps<T>) => TVSlotFunctions<T>

/**
 * The theme's own `compoundVariants` and `defaultVariants` checked against its
 * `variants`, the part of a literal theme inference alone doesn't validate.
 */
export type TVThemeCheck<T> = {
  compoundVariants?: TVCompoundVariants<T>
  defaultVariants?: TVDefaultVariants<T>
}

/**
 * A theme as `defineTheme` returns it: checked, and with each default typed as
 * any value its variant accepts, the way app code reads it
 * (`reactive({ color: [theme.defaultVariants.color] })`).
 */
export type DefinedTheme<T> = {
  [K in keyof T]: K extends 'defaultVariants'
    // A default the variant doesn't accept keeps its own type, so `tv()` still rejects it
    ? { [D in keyof T[K]]: D extends keyof VariantsOf<T> ? T[K][D] extends VariantValue<T, D> ? VariantValue<T, D> : T[K][D] : T[K][D] }
    : T[K]
}

declare const componentOverrides: unique symbol

/**
 * A component's resolved `app.config.ui.<c>`, as `useComponentOverrides`
 * returns it: typed after the theme and the app's own config, so the variant
 * values the app adds (a custom `color`) reach the built component.
 */
export type ComponentOverrides<O> = O & { readonly [componentOverrides]: true }

/**
 * The engine itself: a theme and the overrides on top of it in, a built
 * component out. A component passes its `ComponentOverrides`, accepted as is
 * and widening the variant props; overrides written inline are checked
 * against the theme.
 */
export type TV = {
  <T extends TVTheme, O extends Record<string, any>>(theme: T & TVThemeCheck<T>, overrides: ComponentOverrides<O> | undefined): TVReturnType<T & O>
  <T extends TVTheme>(theme: T & TVThemeCheck<T>, overrides?: TVOverrides<T> | Partial<T> | null): TVReturnType<T>
}

/** A theme whose variant groups also accept values `app.config.ui` adds. */
type WidenTheme<T> = Omit<T, 'variants'> & {
  variants: T extends { variants: infer V extends Record<string, any> }
    ? { [K in keyof V]: V[K] & Record<string & {}, any> }
    : {}
}

/**
 * Defines the AppConfig object based on the theme configuration.
 */
export type TVConfig<T extends Record<string, any>> = {
  [P in keyof T]?: P extends 'prose' ? TVConfig<T[P]> : TVOverrides<WidenTheme<T[P]>>
}

/**
 * Utility type to flatten intersection types for better IDE hover information.
 * @template T The type to flatten.
 */
type Id<T> = {} & { [P in keyof T]: T[P] }

/** The values each variant accepts, the way the component's props declare them. */
type ComponentVariants<T> = {
  [K in keyof VariantsOf<T>]: VariantKey<keyof VariantsOf<T>[K]>
}

/** The `:ui` prop: classes to merge, or a replacer, per slot. */
type ComponentSlots<T> = Id<{
  [K in keyof SlotsOf<T>]?: SlotClass
}>

/** `A['ui']`, or nothing when the base AppConfig has no `ui`. */
type UIOf<A> = A extends { ui: infer UI } ? UI : Record<string, never>

/** `A['ui']['prose']`, or nothing. */
type ProseOf<A> = A extends { ui: { prose?: infer P } } ? NonNullable<P> : Record<string, never>

/** A `ui` object with one component's config typed as its theme. */
type WithComponent<UI, K extends string, T> = Omit<UI, K> & { [k in K]?: Partial<T> }

type GetComponentAppConfig<A, U extends string, K extends string>
  = A extends Record<U, Record<K, any>> ? A[U][K] : {}

type ComponentAppConfig<
  T,
  A extends Record<string, any>,
  K extends string,
  U extends 'ui' | 'ui.prose'
> = Omit<A, 'ui'> & {
  ui: U extends 'ui.prose'
    ? Omit<UIOf<A>, 'prose'> & { prose?: WithComponent<ProseOf<A>, K, T & GetComponentAppConfig<A, U, K>> }
    : WithComponent<UIOf<A>, K, T & GetComponentAppConfig<A, U, K>>
}

/**
 * Defines the configuration shape expected for a component.
 * @template T The component's theme imported from `#build/ui/*`.
 * @template A The base AppConfig type from `@nuxt/schema`.
 * @template K The key identifying the component (e.g., 'badge').
 * @template U The top-level key in AppConfig ('ui' or 'ui.prose').
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
  ui: TVSlotFunctions<T & GetComponentAppConfig<A, U, K>>
}
