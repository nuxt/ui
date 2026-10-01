import { describe, it, expect, afterEach } from 'vitest'
import {
  pick,
  omit,
  get,
  set,
  looseToNumber,
  compare,
  isEmpty,
  getDisplayValue,
  isArrayOfArray,
  getSlotChildrenText,
  transformUI,
  resolveBaseURL
} from '../../src/runtime/utils'

describe('pick', () => {
  it('picks the given keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })
})

describe('omit', () => {
  it('omits the given keys without mutating the input', () => {
    const object = { a: 1, b: 2, c: 3 }
    expect(omit(object, ['b'])).toEqual({ a: 1, c: 3 })
    expect(object).toEqual({ a: 1, b: 2, c: 3 })
  })
})

describe('get', () => {
  it('reads nested values from string and array paths', () => {
    const object = { a: { b: 1 }, items: [{ label: 'a' }] }
    expect(get(object, 'a.b')).toBe(1)
    expect(get(object, 'items.0.label')).toBe('a')
    expect(get(object, ['items', 0, 'label'])).toBe('a')
  })

  it('returns the default value when the path is missing', () => {
    expect(get({ a: null }, 'a.b', 'default')).toBe('default')
    expect(get({ a: {} }, 'a.b', 'default')).toBe('default')
    expect(get(undefined, 'a', 'default')).toBe('default')
  })

  it('returns null instead of the default value', () => {
    expect(get({ a: null }, 'a', 'default')).toBeNull()
  })

  it('does not cast keys to numbers', () => {
    const object = { a: { 1: 'one', 16: 'sixteen' } }
    expect(get(object, 'a.0x10')).toBeUndefined()
    expect(get(object, 'a.01')).toBeUndefined()
  })
})

describe('set', () => {
  afterEach(() => {
    delete (Object.prototype as any).polluted
  })

  it('sets nested values and creates missing objects', () => {
    const object: Record<string, any> = {}
    set(object, 'a.b.c', 1)
    set(object, ['d', 'e'], 2)
    expect(object).toEqual({ a: { b: { c: 1 } }, d: { e: 2 } })
  })

  it('creates arrays for index keys', () => {
    const object: Record<string, any> = {}
    set(object, 'items.0.label', 'a')
    set(object, ['list', 1], 'b')
    expect(object).toEqual({ items: [{ label: 'a' }], list: [undefined, 'b'] })
  })

  it('replaces primitive values in the path', () => {
    const object: Record<string, any> = { a: null, b: 'string' }
    set(object, 'a.c', 1)
    set(object, 'b.c', 2)
    expect(object).toEqual({ a: { c: 1 }, b: { c: 2 } })
  })

  it.each([
    '__proto__.polluted',
    'constructor.prototype.polluted',
    ['__proto__', 'polluted'],
    'a.__proto__.polluted',
    [['__proto__'], 'polluted'],
    [{ toString: () => '__proto__' }, 'polluted']
  ])('does not pollute the prototype with %j', (path) => {
    const object = {}
    set(object, path as any, true)
    expect(object).toEqual({})
    expect(({} as any).polluted).toBeUndefined()
  })
})

describe('looseToNumber', () => {
  it('parses numeric prefixes and keeps other values', () => {
    expect(looseToNumber('12px')).toBe(12)
    expect(looseToNumber('1.5')).toBe(1.5)
    expect(looseToNumber(3)).toBe(3)
    expect(looseToNumber('abc')).toBe('abc')
  })
})

describe('compare', () => {
  it('returns false when either value is undefined', () => {
    expect(compare(undefined, 1)).toBe(false)
    expect(compare(1, undefined)).toBe(false)
    expect(compare(undefined, undefined)).toBe(false)
  })

  it('compares strings strictly', () => {
    expect(compare('a', 'a')).toBe(true)
    expect(compare('a', 'b')).toBe(false)
  })

  it('uses a function comparator', () => {
    expect(compare({ id: 1 }, { id: 1, name: 'a' }, (a, b) => a.id === b.id)).toBe(true)
  })

  it('uses a string comparator as a path', () => {
    expect(compare({ id: 1, name: 'a' }, { id: 1, name: 'b' }, 'id')).toBe(true)
    expect(compare({ id: 1 }, { id: 2 }, 'id')).toBe(false)
  })

  it('falls back to deep equality', () => {
    expect(compare({ a: [1] }, { a: [1] })).toBe(true)
    expect(compare({ a: 1 }, { a: 2 })).toBe(false)
    expect(compare(1, 1)).toBe(true)
  })
})

describe('isEmpty', () => {
  it.each([
    null,
    undefined,
    '',
    '  ',
    [],
    new Map(),
    new Set(),
    {},
    Object.create({ a: 1 })
  ])('returns true for %o', (value) => {
    expect(isEmpty(value)).toBe(true)
  })

  it.each([
    false,
    0,
    'a',
    [1],
    new Map([[1, 1]]),
    new Set([1]),
    new Date(),
    /a/,
    () => {},
    { a: 1 }
  ])('returns false for %o', (value) => {
    expect(isEmpty(value)).toBe(false)
  })
})

describe('getDisplayValue', () => {
  const items = [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }]

  it('returns primitive values as strings', () => {
    expect(getDisplayValue(['a', 'b'], 'b')).toBe('b')
    expect(getDisplayValue(['a'], 'z')).toBe('z')
    expect(getDisplayValue([], 2)).toBe('2')
  })

  it('finds the item with `valueKey` and reads `labelKey`', () => {
    expect(getDisplayValue(items, 2, { valueKey: 'value', labelKey: 'label' })).toBe('Two')
  })

  it('reads `labelKey` from an object value', () => {
    expect(getDisplayValue(items, { value: 3, label: 'Three' }, { labelKey: 'label' })).toBe('Three')
    expect(getDisplayValue(items, { value: 3, label: 'Three' })).toBeUndefined()
  })

  it('returns the label of an item matching an empty value', () => {
    expect(getDisplayValue([{ value: '', label: 'None' }], '', { valueKey: 'value', labelKey: 'label' })).toBe('None')
  })

  it('returns undefined for an empty value without a match', () => {
    expect(getDisplayValue(['a'], '')).toBeUndefined()
    expect(getDisplayValue(['a'], null)).toBeUndefined()
  })

  it('matches items with `by`', () => {
    const users = [{ id: 1, name: 'A' }]
    expect(getDisplayValue(users, { id: 1 }, { labelKey: 'name', by: 'id' })).toBe('A')
    expect(getDisplayValue(users, { id: 1 }, { labelKey: 'name', by: (a, b) => a.id === b.id })).toBe('A')
  })
})

describe('isArrayOfArray', () => {
  it('checks the first item', () => {
    expect(isArrayOfArray([[1], [2]])).toBe(true)
    expect(isArrayOfArray([1, 2])).toBe(false)
    expect(isArrayOfArray([])).toBe(false)
  })
})

describe('getSlotChildrenText', () => {
  it('joins the text of nested children', () => {
    expect(getSlotChildrenText([
      { children: 'Hello ' },
      { children: [{ children: 'World' }] },
      { children: { default: () => [{ children: '!' }] } },
      { children: null }
    ])).toBe('Hello World!')
  })
})

describe('transformUI', () => {
  const ui = {
    base: ({ class: className }: { class?: string }) => ['base', className].filter(Boolean).join(' '),
    label: 'label'
  }

  it('calls slot functions with the `ui` prop class', () => {
    expect(transformUI(ui, { base: 'extra', other: 'other' })).toEqual({ base: 'base extra', label: 'label', other: 'other' })
  })

  it('works without the `ui` prop', () => {
    expect(transformUI(ui)).toEqual({ base: 'base', label: 'label' })
  })
})

describe('resolveBaseURL', () => {
  it('prefixes absolute paths with the base URL', () => {
    expect(resolveBaseURL('/docs', '/app/')).toBe('/app/docs')
    expect(resolveBaseURL('/docs', 'app')).toBe('/app/docs')
  })

  it('keeps paths that already start with the base URL', () => {
    expect(resolveBaseURL('/app/docs', '/app/')).toBe('/app/docs')
  })

  it('keeps protocol-relative, external and relative paths', () => {
    expect(resolveBaseURL('//cdn.com/image.png', '/app/')).toBe('//cdn.com/image.png')
    expect(resolveBaseURL('https://example.com', '/app/')).toBe('https://example.com')
    expect(resolveBaseURL('docs', '/app/')).toBe('docs')
  })

  it('keeps paths without a base URL', () => {
    expect(resolveBaseURL('/docs')).toBe('/docs')
    expect(resolveBaseURL('/docs', '/')).toBe('/docs')
    expect(resolveBaseURL(undefined, '/app/')).toBeUndefined()
  })
})
