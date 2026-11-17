import { defu } from 'defu'
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
  const keys = typeof path === 'string' ? path.split('.') : path

  let result: any = object

  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue
    }

    result = result[key]
  }

  return result !== undefined ? result : defaultValue
}

export function set(object: Record<string, any>, path: (string | number)[] | string, value: any): void {
  const keys: string[] = []

  for (const segment of typeof path === 'string' ? path.split('.') : path) {
    const key = String(segment)
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return
    }

    keys.push(key)
  }

  let current = object

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]!

    if (i === keys.length - 1) {
      current[key] = value
      return
    }

    if (current[key] === null || (typeof current[key] !== 'object' && typeof current[key] !== 'function')) {
      current[key] = /^(?:0|[1-9]\d*)$/.test(keys[i + 1]!) ? [] : {}
    }

    current = current[key]
  }
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

export function findItem<T extends Array<any>, V>(
  items: T,
  value: V | undefined | null,
  options: {
    valueKey?: GetItemKeys<T>
    by?: string | ((a: any, b: any) => boolean)
  } = {}
): T[number] | undefined {
  const { valueKey, by } = options

  return items.find((item) => {
    const itemValue = (typeof item === 'object' && item !== null && valueKey)
      ? get(item, valueKey as string)
      : item
    return compare(itemValue, value, by)
  })
}

export function getSelectedItem<T extends Array<any>>(
  items: T,
  value: unknown,
  options: {
    valueKey?: GetItemKeys<T>
    by?: string | ((a: any, b: any) => boolean)
    multiple?: boolean
  } = {}
): T[number] | T[number][] | undefined {
  const { multiple, ...findOptions } = options

  // Without `valueKey` the model value is the item itself, so keep it when `items` no longer contains it (e.g. async items).
  const resolve = (v: unknown) => findItem(items, v, findOptions) ?? (findOptions.valueKey || v == null ? undefined : v)

  if (multiple) {
    return Array.isArray(value) ? value.map(resolve).filter(item => item !== undefined) : []
  }

  return resolve(value)
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

  const foundItem = findItem(items, value, { valueKey, by })

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

export function isArrayOfArray<
  A extends any[] | any[][]
>(item: A): item is A extends Array<infer T>
  ? T extends any[]
    ? T[]
    : never
  : never {
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
  }, { ...(uiProp || {}) })
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

/**
 * Whether a value is a plain object Vue would compile from a `template` string at render time,
 * or a forged VNode, like one parsed from JSON in untrusted markdown (`:as='{"template":"..."}'`).
 * Components built by the app always carry a `render`, `ssrRender` or `setup` function.
 */
export function isUnsafeComponent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false

  const component = value as Record<string, any>
  if (typeof component.render === 'function' || typeof component.ssrRender === 'function' || typeof component.setup === 'function') return false

  // A VNode or built-in (Teleport, Suspense, KeepAlive) marker is never valid `as` or icon data:
  // a forged one would render its `type` and `props` as is, `innerHTML` included.
  // Vue also unwraps a `__v_raw` key in development, after this check (a real reactive proxy
  // doesn't own it). The built-ins themselves carry functions (`process`), JSON never does.
  if ((component.__v_isVNode || component.__isTeleport || component.__isSuspense || component.__isKeepAlive || Object.hasOwn(component, '__v_raw')) && !Object.values(component).some(item => typeof item === 'function')) return true

  // Vue's full build also compiles an element-like `template` (`nodeType` + `innerHTML`)
  return typeof component.template === 'string'
    || (typeof component.template === 'object' && component.template !== null)
    || isUnsafeComponent(component.extends)
    || (Array.isArray(component.mixins) && component.mixins.some(isUnsafeComponent))
}

// Elements that run or load code from their content or attributes (`srcdoc`, `data`, …)
const UNSAFE_TAGS = new Set(['script', 'style', 'iframe', 'frame', 'frameset', 'object', 'embed', 'applet', 'base', 'link', 'meta', 'noscript'])

/**
 * Whether a value is unsafe to render as an element or component through `as`:
 * an unsafe component object, or a tag like `script` or `iframe`.
 */
export function isUnsafeAs(value: unknown): boolean {
  // A string that isn't a plain tag name (`img src=x onerror=…`) ends up as raw markup in the opening tag
  if (typeof value === 'string') return !/^[a-z][a-z0-9-]*$/i.test(value) || UNSAFE_TAGS.has(value.toLowerCase())
  return isUnsafeComponent(value)
}

/**
 * Drops attributes holding a value `isUnsafeComponent` rejects (or an `as` that `isUnsafeAs`
 * rejects), for components forwarding `$attrs` to a Reka part that renders its `as`.
 */
export function omitUnsafeAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(attrs).filter(([key, value]) => key === 'as' ? !isUnsafeAs(value) : !isUnsafeComponent(value)))
}

/**
 * Resolves an `as` prop that accepts either a single element / component (applied to `root`)
 * or an object targeting multiple elements, e.g. `{ root: 'div', title: 'h3' }`.
 */
export function resolveAs<T extends { root: any }>(as: any, defaults: T): T {
  if (isUnsafeAs(as)) return defaults

  if (
    typeof as === 'string'
    || typeof as === 'function'
    || typeof as?.render === 'function'
    || typeof as?.setup === 'function'
    // Components inheriting their `render` or `setup`
    || !!as?.extends
    || !!as?.mixins
  ) {
    return { ...defaults, root: as }
  }

  return defu(Object.fromEntries(Object.entries(as ?? {}).filter(([, value]) => !isUnsafeAs(value))), defaults) as T
}

export * from './content'
