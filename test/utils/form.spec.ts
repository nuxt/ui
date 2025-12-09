import { describe, it, expect } from 'vitest'
import { getAtPath, setAtPath } from '../../src/runtime/utils/form'

describe('form utils', () => {
  describe('getAtPath', () => {
    it('works', () => {
      const obj: any = { foo: 'bar' }
      expect(getAtPath(obj, 'foo')).toBe('bar')
    })

    it('works with nested attributes', () => {
      const obj: any = { foo: { bar: 'bazz' } }
      expect(getAtPath(obj, 'foo.bar')).toBe('bazz')
      expect(getAtPath(obj, 'foo.bazz')).toBe(undefined)
    })

    it('works with nested arrays', () => {
      const obj: any = { foo: ['bazz'] }
      expect(getAtPath(obj, 'foo.0')).toBe('bazz')
    })

    it('works with deeply nested structures', () => {
      const obj: any = { foo: [{ bar: ['bazz', 'buzz'] }] }
      expect(getAtPath(obj, 'foo.0.bar.1')).toBe('buzz')
      expect(getAtPath(obj, 'foo.1')).toBe(undefined)
    })

    it('returns the main object if path is undefined', () => {
      const obj: any = { foo: ['bazz'] }
      expect(getAtPath(obj)).toBe(obj)
    })
  })

  describe('setAtPath', () => {
    it('works with basic properties', () => {
      const obj: any = { foo: 'bar' }
      const result = setAtPath(obj, 'foo', 'baz')
      expect(obj.foo).toBe('baz')
      expect(result).toBe(obj)
    })

    it('works with empty path using Object.assign', () => {
      const obj: any = { foo: 'bar' }
      const newValue = { baz: 'buzz' }
      const result = setAtPath(obj, '', newValue)
      expect(result).toEqual({ foo: 'bar', baz: 'buzz' })
    })

    it('creates and sets nested objects', () => {
      const obj: any = {}
      setAtPath(obj, 'foo.bar', 'baz')
      expect(obj.foo).toBeInstanceOf(Object)
      expect(obj.foo.bar).toBe('baz')
    })

    it('creates and sets nested arrays when next key is numeric', () => {
      const obj: any = {}
      setAtPath(obj, 'foo.0', 'first')
      expect(obj.foo).toBeInstanceOf(Array)
      expect(obj.foo[0]).toBe('first')
    })

    it('works with deeply nested structures', () => {
      const obj: any = {}
      setAtPath(obj, 'foo.0.bar.1', 'deeply nested')
      expect(obj.foo).toBeInstanceOf(Array)
      expect(obj.foo[0]).toBeInstanceOf(Object)
      expect(obj.foo[0].bar).toBeInstanceOf(Array)
      expect(obj.foo[0].bar[1]).toBe('deeply nested')
    })

    it('overwrites existing values', () => {
      const obj: any = { foo: { bar: 'old' } }
      setAtPath(obj, 'foo.bar', 'new')
      expect(obj.foo.bar).toBe('new')
    })

    it('handles mixed object and array paths', () => {
      const obj: any = {}
      setAtPath(obj, 'users.0.profile.tags.1', 'admin')
      expect(obj.users).toBeInstanceOf(Array)
      expect(obj.users[0]).toBeInstanceOf(Object)
      expect(obj.users[0].profile).toBeInstanceOf(Object)
      expect(obj.users[0].profile.tags).toBeInstanceOf(Array)
      expect(obj.users[0].profile.tags[1]).toBe('admin')
    })

    it('handles null/undefined intermediate values', () => {
      const obj: any = { foo: null }
      setAtPath(obj, 'foo.bar', 'baz')
      expect(obj.foo).toBeInstanceOf(Object)
      expect(obj.foo.bar).toBe('baz')
    })

    it('returns the original object', () => {
      const obj: any = {}
      const result = setAtPath(obj, 'foo.bar', 'baz')
      expect(result).toBe(obj)
    })
  })
})
