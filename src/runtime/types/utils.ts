import type { VNode } from 'vue'
import type { AcceptableValue as _AcceptableValue } from 'reka-ui'

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] | undefined
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

// NOTE: `Boolean` could potentially cause casting issues, but have been safe so far.
// https://vuejs.org/guide/components/props.html#boolean-casting
export type AcceptableValue = Exclude<_AcceptableValue, Record<string, any>> | boolean
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

type DotPathKeys<T> = T extends Array<any>
  ? never
  : T extends object
    ? {
        [K in keyof T & string]:
        T[K] extends Record<string, any>
          ? K | `${K}.${DotPathKeys<NonNullable<T[K]>>}`
          : K
      }[keyof T & string]
    : never

type DotPathValue<T, P extends DotPathKeys<T> | (string & {})>
  = P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? DotPathValue<NonNullable<T[K]>, Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never

export type GetItemKeys<I> = keyof Extract<NestedItem<I>, object> | DotPathKeys<Extract<NestedItem<I>, object>>

export type GetItemValue<
  I,
  VK extends GetItemKeys<I> | undefined,
  O extends object | undefined = undefined,
  T extends NestedItem<I> = NestedItem<I>
>
  = T extends object
    ? VK extends undefined
      ? T extends O
        ? never
        : T
      : VK extends DotPathKeys<T>
        ? DotPathValue<T, VK>
        : never
    : T

export type GetModelValue<
  I,
  VK extends GetItemKeys<I> | undefined,
  M extends boolean,
  O extends object | undefined = undefined
> = M extends true
  ? GetItemValue<I, VK, O>[]
  : GetItemValue<I, VK, O>

export type GetModelValueEmits<
  I,
  VK extends GetItemKeys<I> | undefined,
  M extends boolean,
  O extends object | undefined = undefined
> = {
  /** Event handler called when the value changes. */
  'update:modelValue': [value: GetModelValue<I, VK, M, O>]
}

export type StringOrVNode
  = | string
    | VNode
    | (() => VNode)

export type EmitsToProps<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: T[K] extends [...args: infer Args]
    ? (...args: Args) => void
    : never
}

export type NonUnion<T> = [T] extends [infer U]
  ? _NonUnion<U, U>
  : never
type _NonUnion<T, U> = U extends any
  ? [T] extends [U]
      ? unknown
      : never
  : never
