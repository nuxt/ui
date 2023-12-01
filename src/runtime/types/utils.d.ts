export type Strategy = 'merge' | 'override'

export type NestedKeyOf<ObjectType extends Record<string, any>> = {
  [Key in keyof ObjectType]: ObjectType[Key] extends Record<string, any>
  ? NestedKeyOf<ObjectType[Key]>
  : Key
}[keyof ObjectType]

export type DeepPartial<T> = Partial<{
  [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string | object }
}>

type DeepKey<T, Keys extends string[]> =
  Keys extends [infer First, ...infer Rest]
    ? First extends keyof T
      ? Rest extends string[]
        ? DeepKey<T[First], Rest>
        : never
      : never
    : T

export type ExtractDeepKey<T, Path extends string[]> = DeepKey<T, Path> extends infer Result
  ? Result extends Record<string, any> ? keyof Result : never
  : never

export type ExtractDeepObject<T, Path extends string[]> = DeepKey<T, Path> extends infer Result
  ? Result extends Record<string, any> ? Result : never
  : never
