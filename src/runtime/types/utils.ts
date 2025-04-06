import type { AcceptableValue as _AcceptableValue } from 'reka-ui'
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

export type DynamicSlots<
  T extends { slot?: string },
  S extends string | undefined = undefined,
  D extends object = {}
> = {
  [
  K in T['slot'] as K extends string
    ? S extends string
      ? (K | `${K}-${S}`)
      : K
    : never
  ]?: (props: { item: Extract<T, { slot: K extends `${infer Base}-${S}` ? Base : K }> } & D) => any
}

export type GetObjectField<MaybeObject, Key extends string> = MaybeObject extends Record<string, any>
  ? MaybeObject[Key]
  : never

export type PartialString<T> = {
  [K in keyof T]?: string
}

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
