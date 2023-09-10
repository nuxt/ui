import { kebabCase, camelCase, upperFirst } from 'scule'
import { isEqual } from 'ohash'

type OmitObject<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function omit<T extends Record<string, any>, K extends keyof T> (
  object: T,
  keysToOmit: K[] | any[]
): OmitObject<T, K> {
  const result = { ...object }

  for (const key of keysToOmit) {
    delete result[key]
  }

  return result as OmitObject<T, K>
}


type Path = (string | number)[] | string;

export function get (object: Record<string, any>, path: Path, defaultValue?: any): any {
  if (typeof path === 'string') {
    path = path.split('.').map(key => {
      const numKey = Number(key)
      return isNaN(numKey) ? key : numKey
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

export function omitBy<T> (
  obj: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> {
  return Object.keys(obj).reduce((acc, key) => {
    if (!predicate(obj[key], key)) {
      acc[key] = obj[key]
    }
    return acc
  }, {} as Record<string, T>)
}

type Order = 'asc' | 'desc';

export function orderBy<T> (array: T[], key: keyof T, order: Order = 'asc'): T[] {
  return array.slice().sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (aValue === bValue) {
      return 0
    }

    if (order === 'asc') {
      return aValue < bValue ? -1 : 1
    } else {
      return aValue > bValue ? -1 : 1
    }
  })
}

export function pick<T extends Record<string, any>, K extends keyof T> (
  obj: T,
  keys: K[]
): Pick<T, K> {
  const picked: Partial<Pick<T, K>> = {}
  for (const key of keys) {
    if (key in obj) {
      picked[key] = obj[key]
    }
  }
  return picked as Pick<T, K>
}

export { kebabCase, camelCase, upperFirst, isEqual }
