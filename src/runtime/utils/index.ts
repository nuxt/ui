import { isEqual } from 'ohash/utils'
import type { GetItemKeys, NestedItem, Paths, PathValue } from '../types/utils'

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

export function get<T extends Record<string, any>, P extends Paths<T>>(object: T | undefined, path: P): PathValue<Required<T>, P> | undefined
export function get<T extends Record<string, any>, P extends Paths<T>, D>(object: T | undefined, path: P, defaultValue: D): Exclude<PathValue<Required<T>, P>, undefined> | D
export function get(object: Record<string, any> | undefined, path: string | (string | number)[], defaultValue?: any): any
export function get(object: Record<string, any> | undefined, path: string | (string | number)[], defaultValue?: any) {
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

export function getDisplayValue<T, V>(
  items: T[],
  value: V | undefined | null,
  options: {
    valueKey?: GetItemKeys<T>
    labelKey?: keyof NestedItem<T>
  } = {}
): string | undefined {
  const { valueKey, labelKey } = options

  if (value === null || value === undefined) {
    return undefined
  }

  const foundItem = items.find((item) => {
    const itemValue = (typeof item === 'object' && item !== null && valueKey)
      ? get(item, valueKey as string)
      : item
    return compare(itemValue, value)
  })

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

export function isDateObject(value: unknown): value is Date {
  return value instanceof Date
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value == null
}

export function isObject<T extends object>(value: unknown): value is T {
  return !isNullOrUndefined(value) && !Array.isArray(value) && typeof value === 'object' && !isDateObject(value)
}

export function isPlainObject(tempObject: object) {
  const prototypeCopy
    = tempObject.constructor && tempObject.constructor.prototype

  return (
    isObject(prototypeCopy) && Object.prototype.hasOwnProperty.call(prototypeCopy, 'isPrototypeOf')
  )
};

export const isWeb = typeof window !== 'undefined'
  && typeof window.HTMLElement !== 'undefined'
  && typeof document !== 'undefined'

export function cloneObject<T>(data: T): T {
  let copy: any
  const isArray = Array.isArray(data)
  const isFileListInstance
    = typeof FileList !== 'undefined' ? data instanceof FileList : false

  if (data instanceof Date) {
    copy = new Date(data)
  } else if (
    !(isWeb && (data instanceof Blob || isFileListInstance))
    && (isArray || isObject(data))
  ) {
    copy = isArray ? [] : Object.create(Object.getPrototypeOf(data))

    if (!isArray && !isPlainObject(data)) {
      copy = data
    } else {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          copy[key] = cloneObject(data[key])
        }
      }
    }
  } else {
    return data
  }

  return copy
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
