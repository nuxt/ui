export interface ModelModifiers {
  nullable?: boolean
  number?: boolean
  optional?: boolean
  trim?: boolean
  lazy?: boolean
}

export type ApplyModifiers<T, M extends ModelModifiers = ModelModifiers> = _Number<_Optional<_Nullable<T, M>, M>, M>

type _Nullable<T, M> = M extends { nullable: true } ? T | null : T
type _Optional<T, M> = M extends { optional: true } ? T | undefined : T
type _Number<T, M> = M extends { number: true }
  ? T extends string
    ? T | number
    : T
  : T
