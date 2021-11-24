export * from './popper'

export function classNames (...classes: any[string]) {
  return classes.filter(Boolean).join(' ')
}
