import { kebabCase, camelCase, upperFirst } from 'scule'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function omit<T extends Record<string, any>, K extends keyof T> (obj: T, keysToOmit: K[]): Omit<T, K> {
  const result: Record<string, any> = {}
  for (const key in obj) {
    if (!keysToOmit.includes(key as unknown as K)) {
      result[key] = obj[key]
    }
  }
  return result as Omit<T, K>
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


export function isEqual<T> (valueA: T, valueB: T): boolean {
  if (valueA === valueB) {
    return true
  }

  if (typeof valueA !== 'object' || typeof valueB !== 'object') {
    return false
  }

  const keysA = Object.keys(valueA)
  const keysB = Object.keys(valueB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!keysB.includes(key)) {
      return false
    }

    if (!isEqual(valueA[key], valueB[key])) {
      return false
    }
  }

  return true
}

export function groupBy<T, K> (
  array: T[],
  getKey: (item: T) => K
): any[][] {
  const groups: any[][] = Object.values(
    array.reduce((map, item) => {
      const key = String(getKey(item))
      const group = map[key]

      if (group) {
        group.push(item)
      } else {
        map[key] = [item]
      }

      return map
    }, {} as Record<string, T[]>)
  )

  return groups
}



export function map<T, U> (array: T[], callback: (item: T, index: number, array: T[]) => U): U[] {
  const result: U[] = []

  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array))
  }

  return result
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

export function isUndefined (value: any): boolean {
  return value === undefined
}

export function capitalize (input: string): string {
  if (typeof input !== 'string' || input.length === 0) {
    return ''
  }

  return input.charAt(0).toUpperCase() + input.slice(1)
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

export { kebabCase, camelCase, upperFirst }
