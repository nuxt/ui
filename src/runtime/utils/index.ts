import { isEqual } from 'ohash/utils'
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo'
import type { GetItemKeys } from '../types/utils'

export function pick<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Pick<Data, Keys> {
  const result = {} as Pick<Data, Keys>

  for (const key of keys) {
    result[key] = data[key]
  }

  return result
}

export function omit<Data extends object, Keys extends keyof Data>(data: Data, keys: Keys[]): Omit<Data, Keys> {
  const result = { ...data }

  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete result[key]
  }

  return result as Omit<Data, Keys>
}

export function get(object: Record<string, any> | undefined, path: (string | number)[] | string, defaultValue?: any): any {
  if (typeof path === 'string') {
    path = path.split('.').map((key) => {
      const numKey = Number(key)
      return Number.isNaN(numKey) ? key : numKey
    })
  }

  let result: any = object

  for (const key of path) {
    if (result === undefined || result === null) {
      return defaultValue
    }

    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

export function set(object: Record<string, any>, path: (string | number)[] | string, value: any): void {
  if (typeof path === 'string') {
    path = path.split('.').map((key) => {
      const numKey = Number(key)
      return Number.isNaN(numKey) ? key : numKey
    })
  }

  path.reduce((acc, key, i) => {
    if (acc[key] === undefined) acc[key] = {}
    if (i === path.length - 1) acc[key] = value
    return acc[key]
  }, object)
}

export function looseToNumber(val: any): any {
  const n = Number.parseFloat(val)
  return Number.isNaN(n) ? val : n
}

export function compare<T>(value?: T, currentValue?: T, comparator?: string | ((a: T, b: T) => boolean)) {
  if (value === undefined || currentValue === undefined) {
    return false
  }

  if (typeof value === 'string') {
    return value === currentValue
  }

  if (typeof comparator === 'function') {
    return comparator(value, currentValue)
  }

  if (typeof comparator === 'string') {
    return get(value!, comparator) === get(currentValue!, comparator)
  }

  return isEqual(value, currentValue)
}

export function isEmpty(value: unknown): boolean {
  if (value == null) {
    return true
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }

  if (value instanceof Date || value instanceof RegExp || typeof value === 'function') {
    return false
  }

  if (typeof value === 'object') {
    for (const _ in value as object) {
      if (Object.prototype.hasOwnProperty.call(value, _)) {
        return false
      }
    }
    return true
  }

  return false
}

export function getDisplayValue<T extends Array<any>, V>(
  items: T,
  value: V | undefined | null,
  options: {
    valueKey?: GetItemKeys<T>
    labelKey?: GetItemKeys<T>
    by?: string | ((a: any, b: any) => boolean)
  } = {}
): string | undefined {
  const { valueKey, labelKey, by } = options

  const foundItem = items.find((item) => {
    const itemValue = (typeof item === 'object' && item !== null && valueKey)
      ? get(item, valueKey as string)
      : item
    return compare(itemValue, value, by)
  })

  if (isEmpty(value) && foundItem) {
    return labelKey ? get(foundItem as Record<string, any>, labelKey as string) : undefined
  }

  if (isEmpty(value)) {
    return undefined
  }

  const source = foundItem ?? value

  if (source === null || source === undefined) {
    return undefined
  }

  if (typeof source === 'object') {
    return labelKey ? get(source as Record<string, any>, labelKey as string) : undefined
  }

  return String(source)
}

export function isArrayOfArray<A>(item: A[] | A[][]): item is A[][] {
  return Array.isArray(item[0])
}

export function mergeClasses(appConfigClass?: string | string[], propClass?: string) {
  if (!appConfigClass && !propClass) {
    return ''
  }

  return [
    ...(Array.isArray(appConfigClass) ? appConfigClass : [appConfigClass]),
    propClass
  ].filter(Boolean)
}

export function getSlotChildrenText(children: any) {
  return children.map((node: any) => {
    if (!node.children || typeof node.children === 'string') return node.children || ''
    else if (Array.isArray(node.children)) return getSlotChildrenText(node.children)
    else if (node.children.default) return getSlotChildrenText(node.children.default())
  }).join('')
}

export function transformUI(ui: any, uiProp?: any) {
  return Object.entries(ui).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'function' ? value({ class: uiProp?.[key] }) : value
    return acc
  }, uiProp || {})
}

export function resolveBaseURL(path?: string, baseURL?: string): string | undefined {
  if (path?.startsWith('/') && !path.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(baseURL || '/'))
    if (_base !== '/' && !path.startsWith(_base)) {
      return joinURL(_base, path)
    }
  }
  return path
}

export * from './content'
