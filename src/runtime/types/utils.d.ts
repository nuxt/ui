export type DeepPartial<T> = Partial<{
  [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string | object }
}>
