export interface TightMap<O = any> {
  [key: string]: TightMap | O
}

export type DeepPartial<T, O = any> = {
  [P in keyof T]?: T[P] extends object
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

export type AcceptableValue = string | number | boolean | Record<string, any>

export type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

export type PartialString<T> = {
  [K in keyof T]?: string
}

export type MaybeArrayOfArray<T> = T[][] | readonly (readonly T[])[] | T[]

export type MaybeArrayOfArrayItem<I> = UnionToOptionalIntersection<I extends readonly (readonly (infer T)[])[] ? T :
  I extends readonly (infer T)[][] ? T :
    I extends readonly (infer T)[][] ? T :
      I extends readonly (infer T)[] ? T
        : never>

export type SelectModelValue<T, V, M extends boolean = false, DV = T> = (T extends Record<string, any> ? V extends keyof T ? T[V] : DV : T) extends infer U ? M extends true ? U[] : U : never

export type SelectItemKey<T> = T extends Record<string, any> ? keyof T : string

export type SelectModelValueEmits<T, V, M extends boolean = false, DV = T> = {
  'update:modelValue': [payload: SelectModelValue<T, V, M, DV>]
}

type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (x: infer I) => any ? I : never

type UnionToOptionalIntersection<U> = UnionToIntersection<U> extends infer I ?
{ [K in keyof I as K extends keyof U ? K : never]: K extends keyof U ? U[K] : never } &
Partial<Omit<I, keyof U>> extends infer O ? { [K in keyof O]: O[K] }
  : never
  : never

export type Mutable<T> = { -readonly [P in keyof T]: T[P] } extends infer R ? { [K in keyof R]: R[K] } : never

export type SlotsFromItems<Item, Key extends keyof Item> = UnionToIntersection<Item extends infer U ? Key extends keyof U ? {
  [K in U[Key] as K extends string ? K : never]: U
} : never : never>

export type SuffixSlot<S extends string, T> = {
  [K in keyof T as K extends string ? K | `${S}-${K}` : never]: T[K]
} & Record<string, any>
