export type DeepPartial<T> = Partial<{
  [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string | object }
}>

export type DynamicSlots<T extends { slot?: string }, SlotProps, Slot = T['slot']> =
  Record<string, SlotProps> & (Slot extends string ? Record<Slot, SlotProps> : Record<string, never>)

export type GetObjectField<MaybeObject, Key extends string> = MaybeObject extends Record<string, any>
  ? MaybeObject[Key]
  : never

export type AcceptableValue = string | number | boolean | Record<string, any>

export type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>
