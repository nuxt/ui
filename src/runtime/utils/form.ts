import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema, ValidationError as YupError } from 'yup'
import type { Struct } from 'superstruct'
import type { FormSchema, ValidateReturnSchema } from '../types/form'

export function isYupSchema(schema: any): schema is YupObjectSchema<any> {
  return schema.validate && schema.__isYupSchema__
}

export function isYupError(error: any): error is YupError {
  return error.inner !== undefined
}

export function isSuperStructSchema(schema: any): schema is Struct<any, any> {
  return (
    'schema' in schema
    && typeof schema.coercer === 'function'
    && typeof schema.validator === 'function'
    && typeof schema.refiner === 'function'
  )
}

export function isJoiSchema(schema: any): schema is JoiSchema {
  return schema.validateAsync !== undefined && schema.id !== undefined
}

export function isJoiError(error: any): error is JoiError {
  return error.isJoi === true
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

async function validateYupSchema(
  state: any,
  schema: YupObjectSchema<any>
): Promise<ValidateReturnSchema<typeof state>> {
  try {
    const result = await schema.validate(state, { abortEarly: false })
    return {
      errors: null,
      result
    }
  } catch (error) {
    if (isYupError(error)) {
      const errors = error.inner.map(issue => ({
        name: issue.path ?? '',
        message: issue.message
      }))

      return {
        errors,
        result: null
      }
    } else {
      throw error
    }
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

async function validateJoiSchema(
  state: any,
  schema: JoiSchema
): Promise<ValidateReturnSchema<typeof state>> {
  try {
    const result = await schema.validateAsync(state, { abortEarly: false })
    return {
      errors: null,
      result
    }
  } catch (error) {
    if (isJoiError(error)) {
      const errors = error.details.map(issue => ({
        name: issue.path.join('.'),
        message: issue.message
      }))

      return {
        errors,
        result: null
      }
    } else {
      throw error
    }
  }
}

export function validateSchema<T extends object>(state: T, schema: FormSchema<T>): Promise<ValidateReturnSchema<typeof state>> {
  if (isStandardSchema(schema)) {
    return validateStandardSchema(state, schema)
  } else if (isJoiSchema(schema)) {
    return validateJoiSchema(state, schema)
  } else if (isYupSchema(schema)) {
    return validateYupSchema(state, schema)
  } else if (isSuperStructSchema(schema)) {
    return validateSuperstructSchema(state, schema)
  } else {
    throw new Error('Form validation failed: Unsupported form schema')
  }
}
