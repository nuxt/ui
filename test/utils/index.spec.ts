import { describe, it, expect, afterEach } from 'vitest'
import { set } from '../../src/runtime/utils'

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
