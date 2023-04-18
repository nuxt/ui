export * from './avatar'
export * from './clipboard'
export * from './command-palette'
export * from './popper'
export * from './toast'

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string } }>
