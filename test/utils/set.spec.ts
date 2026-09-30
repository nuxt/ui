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

  it.each([
    '__proto__.polluted',
    'constructor.prototype.polluted',
    ['__proto__', 'polluted'],
    'a.__proto__.polluted'
  ])('does not pollute the prototype with %j', (path) => {
    set({}, path, true)
    expect(({} as any).polluted).toBeUndefined()
  })
})
