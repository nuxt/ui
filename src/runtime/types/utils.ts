import type { AcceptableValue as _AcceptableValue } from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'
import type { VNode } from 'vue'

export interface TightMap<O = any> {
  [key: string]: TightMap | O
}

export type DeepPartial<T, O = any> = {
  [P in keyof T]?: T[P] extends Array<string>
    ? string
    : T[P] extends object
      ? DeepPartial<T[P], O>
      : T[P];
} & {
  [key: string]: O | TightMap<O>
}

export type DynamicSlotsKeys<Name extends string | undefined, Suffix extends string | undefined = undefined> = (
  Name extends string
    ? Suffix extends string
      ? Name | `${Name}-${Suffix}`
      : Name
    : never
)
export type DynamicSlots<
  T extends { slot?: string },
  Suffix extends string | undefined = undefined,
  ExtraProps extends object = {}
> = {
  [K in DynamicSlotsKeys<T['slot'], Suffix>]: (
    props: { item: Extract<T, { slot: K extends `${infer Base}-${Suffix}` ? Base : K }> } & ExtraProps
  ) => any
}

export type GetObjectField<MaybeObject, Key extends string> = MaybeObject extends Record<string, any>
  ? MaybeObject[Key]
  : never

export type AcceptableValue = Exclude<_AcceptableValue, Record<string, any>>
export type ArrayOrNested<T> = T[] | T[][]
export type NestedItem<T> = T extends Array<infer I> ? NestedItem<I> : T
type AllKeys<T> = T extends any ? keyof T : never
type NonCommonKeys<T extends object> = Exclude<AllKeys<T>, keyof T>
type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
  ? T extends { [k in K]?: any }
    ? T[K]
    : undefined
  : never
export type MergeTypes<T extends object> = {
  [k in keyof T]: PickTypeOf<T, k>;
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
}

export type GetItemKeys<I> = keyof Extract<NestedItem<I>, object>

export type GetItemValue<I, VK extends GetItemKeys<I> | undefined, T extends NestedItem<I> = NestedItem<I>> =
T extends object
  ? VK extends undefined
    ? T
    : VK extends keyof T
      ? T[VK]
      : never
  : T

export type GetModelValue<
  T,
  VK extends GetItemKeys<T> | undefined,
  M extends boolean
> = M extends true
  ? GetItemValue<T, VK>[]
  : GetItemValue<T, VK>

export type GetModelValueEmits<
  T,
  VK extends GetItemKeys<T> | undefined,
  M extends boolean
> = {
  /** Event handler called when the value changes. */
  'update:modelValue': [payload: GetModelValue<T, VK, M>]
}

export type StringOrVNode =
  | string
  | VNode
  | (() => VNode)

export type EmitsToProps<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: T[K] extends [...args: infer Args]
    ? (...args: Args) => void
    : never
}

/**
 * Utility type to flatten intersection types for better IDE hover information.
 * @template T The type to flatten.
 */
type Id<T> = {} & { [P in keyof T]: T[P] }

type ComponentVariants<T extends { variants?: Record<string, Record<string, any>> }> = {
  [K in keyof T['variants']]: keyof T['variants'][K]
}

type ComponentSlots<T extends { slots?: Record<string, any> }> = Id<{
  [K in keyof T['slots']]?: ClassValue
}>

type GetComponentAppConfig<A, U extends string, K extends string> =
  A extends Record<U, Record<K, any>> ? A[U][K] : {}

type ComponentAppConfig<
  T,
  A extends Record<string, any>,
  K extends string,
  U extends string = 'ui' | 'uiPro' | 'uiPro.prose'
> = A & (
  U extends 'uiPro.prose'
    ? { uiPro?: { prose?: { [k in K]?: Partial<T> } } }
    : { [key in Exclude<U, 'uiPro.prose'>]?: { [k in K]?: Partial<T> } }
)

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
  U extends 'ui' | 'uiPro' | 'uiPro.prose' = 'ui'
> = {
  AppConfig: ComponentAppConfig<T, A, K, U>
  variants: ComponentVariants<T & GetComponentAppConfig<A, U, K>>
  slots: ComponentSlots<T>
}
