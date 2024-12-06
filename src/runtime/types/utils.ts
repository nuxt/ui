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

export type MaybeArrayOfArray<T> = T[] | T[][]
export type MaybeArrayOfArrayItem<I> = I extends Array<infer T> ? T extends Array<infer U> ? U : T : never

export type SelectModelValue<T, V, M extends boolean = false, DV = T> = (T extends Record<string, any> ? V extends keyof T ? T[V] : DV : T) extends infer U ? M extends true ? U[] : U : never

export type SelectItemKey<T> = T extends Record<string, any> ? keyof T : string

export type SelectModelValueEmits<T, V, M extends boolean = false, DV = T> = {
  'update:modelValue': [payload: SelectModelValue<T, V, M, DV>]
}
