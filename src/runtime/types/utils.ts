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

export type GetObjectField<MaybeObject, Key extends string> = MaybeObject extends Record<string, any>
  ? MaybeObject[Key]
  : never

export type AcceptableValue = string | number | boolean | Record<string, any>

export type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

export type PartialString<T> = {
  [K in keyof T]?: string
}

export type SelectModelValue<T, V, M extends boolean = false, DV = T> = (T extends Record<string, any> ? V extends keyof T ? T[V] : DV : T) extends infer U ? M extends true ? U[] : U : never

export type SelectItemKey<T> = T extends Record<string, any> ? keyof T : string

export type SelectModelValueEmits<T, V, M extends boolean = false, DV = T> = {
  'update:modelValue': [payload: SelectModelValue<T, V, M, DV>]
}

type _Combine<T, K extends PropertyKey = T extends unknown ? keyof T : never> = T extends unknown ? T & Partial<Record<Exclude<K, keyof T>, never>> : never

type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends ((k: infer I) => void) ? I : never

type Combine<T> = { [K in keyof _Combine<T>]: _Combine<T>[K] } extends infer R ? { [K in keyof R]: R[K] } : never

type Mutable<T> = { -readonly [P in keyof T]: T[P] } extends infer R ? { [K in keyof R]: R[K] } : never

type SlotsFromItems<Item, Key> = UnionToIntersection<
  Key extends keyof Item ? Item extends infer _ ? {
    [K in Item[Key] as K extends string ? K : never]: Mutable<Item>
  } : never : never
>

type SuffixSlot<S extends string | null, T> = {
  [K in keyof T as K extends string ? S extends string ? K | `${K}-${S}` : K : never]: T[K]
}

export type MaybeReadonlyArray<T> = T[] | readonly T[]

export type MaybeArrayOfArray<T> = MaybeReadonlyArray<MaybeReadonlyArray<T>> | MaybeReadonlyArray<T>

export type MaybeArrayOfArrayItem<I> = I extends (infer U)[] ? U extends (infer V)[] ? V : U :
  I extends readonly (infer U)[] ? U extends readonly (infer V)[] ? V : U : never

export type DynamicSlots<
  Items,
  Suffix extends string | null = '',
  I extends string | null = 'item',
  K extends string = 'slot'
> = SuffixSlot<
  Suffix,
  MaybeArrayOfArrayItem<Items> extends infer U ? { [K in I as K extends string ? K : never]: Mutable<Combine<U>> } & SlotsFromItems<U, K> : never
>
