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

export type DynamicSlots<T extends { slot?: string }, SlotProps, Slot = T['slot']> =
  Record<string, SlotProps> & (Slot extends string ? Record<Slot, SlotProps> : Record<string, never>)

export type GetObjectField<MaybeObject, Key extends string> = MaybeObject extends Record<string, any>
  ? MaybeObject[Key]
  : never

export type PartialString<T> = {
  [K in keyof T]?: string
}

export type ArrayOrNested<T> = T[] | T[][]
export type NestedItem<T> = T extends Array<infer I> ? NestedItem<I> : T
export type AcceptableValue = Exclude<_AcceptableValue, Record<string, any>>

export type SelectItemKey<T extends ArrayOrNested<unknown>, _T extends NestedItem<T> = NestedItem<T>> = _T extends AcceptableValue ? never : keyof _T

type GetValue<I, VK extends SelectItemKey<any> | undefined> =
I extends object
  ? VK extends undefined
    ? I
    : VK extends keyof I
      ? I[VK]
      : never
  : I

export type SelectModelValue<
  A extends ArrayOrNested<unknown>,
  VK extends SelectItemKey<A> | undefined,
  M extends boolean
> = NestedItem<A> extends infer I
  ? M extends true
    ? GetValue<I, VK>[]
    : GetValue<I, VK>
  : never

export type SelectModelValueEmits<
  A extends ArrayOrNested<unknown>,
  VK extends SelectItemKey<A> | undefined,
  M extends boolean
> = {
  /** Event handler called when the value changes. */
  'update:modelValue': [payload: SelectModelValue<A, VK, M>]
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
