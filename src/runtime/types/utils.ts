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

export type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

export type PartialString<T> = {
  [K in keyof T]?: string
}
