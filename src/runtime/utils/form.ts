import { toRaw } from 'vue'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Struct } from 'superstruct'
import type { FormSchema, ValidateReturnSchema } from '../types/form'

export function isSuperStructSchema(schema: any): schema is Struct<any, any> {
  return (
    'schema' in schema
    && typeof schema.coercer === 'function'
    && typeof schema.validator === 'function'
    && typeof schema.refiner === 'function'
  )
}

export function isStandardSchema(schema: any): schema is StandardSchemaV1 {
  return '~standard' in schema
}

export async function validateStandardSchema(
  state: any,
  schema: StandardSchemaV1
): Promise<ValidateReturnSchema<typeof state>> {
  const result = await schema['~standard'].validate(state)

  if (result.issues) {
    return {
      errors: result.issues?.map(issue => ({
        name: issue.path?.map(item => typeof item === 'object' ? item.key : item).join('.') || '',
        message: issue.message
      })) || [],
      result: null
    }
  }

  return {
    errors: null,
    result: result.value
  }
}

async function validateSuperstructSchema(state: any, schema: Struct<any, any>): Promise<ValidateReturnSchema<typeof state>> {
  const [err, result] = schema.validate(state)
  if (err) {
    const errors = err.failures().map(error => ({
      message: error.message,
      name: error.path.join('.')
    }))

    return {
      errors,
      result: null
    }
  }

  return {
    errors: null,
    result
  }
}

export function validateSchema<T extends object>(state: T, _schema: FormSchema<T>): Promise<ValidateReturnSchema<typeof state>> {
  // Schemas stored in reactive state reach us as Vue proxies. Zod 4.5 resolves
  // `~standard` through a lazy getter that captures the proxy as `this`, then
  // reads its non-configurable `_zod` internals through it, which violates the
  // proxy invariant and throws.
  const schema = toRaw(_schema)

  if (isStandardSchema(schema)) {
    return validateStandardSchema(state, schema)
  } else if (isSuperStructSchema(schema)) {
    return validateSuperstructSchema(state, schema)
  } else {
    throw new Error('Form validation failed: Unsupported form schema')
  }
}

export function getAtPath<T extends object>(
  data: T,
  path?: string
) {
  if (!path) return data
  const value = path
    .split('.')
    .reduce(
      (value, key) => (value as any)?.[key],
      data as any
    )

  return value
}

function isPlainObject(value: unknown): value is Record<string, any> {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * Returns a copy of `data` with `value` merged in at `path`, copying each level on the way so `data` is never mutated.
 */
export function mergeAtPath<T>(data: T, path: string | undefined, value: any): T {
  if (!path) {
    return isPlainObject(data) && isPlainObject(value) ? { ...data, ...value } as T : value
  }

  const [key, ...rest] = path.split('.') as [string, ...string[]]
  const copy: any = Array.isArray(data) ? [...data] : data == null && /^\d+$/.test(key) ? [] : { ...data }
  copy[key] = mergeAtPath(copy[key], rest.join('.'), value)
  return copy
}

export function setAtPath<T extends object>(
  data: T,
  path: string,
  value: any
): T {
  if (!path) return Object.assign(data, value)
  if (!data) return data

  const keys = path.split('.')
  let current = data as Record<string, any>

  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    if (current[key] === undefined || current[key] === null) {
      // If the next key is a number, initialize as array
      if (i + 1 < keys.length && !Number.isNaN(Number(keys[i + 1]))) {
        current[key] = []
      } else {
        current[key] = {}
      }
    }

    current = current[key]
  }

  // Set the final value
  const lastKey = keys[keys.length - 1]!
  current[lastKey] = value

  return data
}
