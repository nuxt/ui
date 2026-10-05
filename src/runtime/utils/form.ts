import { toRaw } from 'vue'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { Struct } from 'superstruct'
import type { FormSchema, ValidateReturnSchema } from '../types/form'
import { get, set } from './index'

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

  return get(data, path)
}

export function setAtPath<T extends object>(
  data: T,
  path: string,
  value: any
): T {
  if (!path) return Object.assign(data, value)
  if (!data) return data

  set(data, path, value)

  return data
}
