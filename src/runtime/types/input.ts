export interface ModelModifiers {
  nullable?: boolean
  number?: boolean
  trim?: boolean
  optional?: boolean
  lazy?: boolean
}

export type ApplyModifiers<T, M extends ModelModifiers = ModelModifiers> = _Trim<_Number<_Optional<_Nullable<T, M>, M>, M>, M>

type _Nullable<T, M> = M extends { nullable: true } ? T | null : T
type _Optional<T, M> = M extends { optional: true } ? T | undefined : T
type _Number<T, M> = M extends { number: true } ? T | number : T
type _Trim<T, M> = M extends { trim: true }
  ? T extends string
    ? T
    : never
  : T
