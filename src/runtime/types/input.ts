export interface ModelModifiers {
  nullable?: boolean
  number?: boolean
  string?: boolean
  trim?: boolean
  optional?: boolean
  lazy?: boolean
}

export type ApplyModifiers<T, M extends ModelModifiers = ModelModifiers>
  = | T
    | (M extends { nullable: true } ? null : never)
    | (M extends { optional: true } ? undefined : never)
    | (M extends { number: true } ? number : never)
    | (M extends { string: true } ? string : never)
    | (M extends { trim: true } ? string : never)
