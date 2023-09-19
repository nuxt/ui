export * from './accordion'
export * from './avatar'
export * from './button'
export * from './clipboard'
export * from './command-palette'
export * from './dropdown'
export * from './form'
export * from './link'
export * from './notification'
export * from './popper'
export * from './tabs'
export * from './vertical-navigation'

export type Strategy = 'merge' | 'override'

export type NestedKeyOf<ObjectType extends object> =
  {[Key in keyof ObjectType]: ObjectType[Key] extends object
    ? NestedKeyOf<ObjectType[Key]>
    : Key
  }[keyof ObjectType]

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string } }>
