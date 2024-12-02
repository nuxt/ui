import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ZodSchema } from 'zod'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema, ValidationError as YupError } from 'yup'
import type { GenericSchema as ValibotSchema, GenericSchemaAsync as ValibotSchemaAsync, SafeParser as ValibotSafeParser, SafeParserAsync as ValibotSafeParserAsync } from 'valibot'
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

export function isZodSchema(schema: any): schema is ZodSchema {
  return schema.parse !== undefined
}

export function isJoiSchema(schema: any): schema is JoiSchema {
  return schema.validateAsync !== undefined && schema.id !== undefined
}

export function isJoiError(error: any): error is JoiError {
  return error.isJoi === true
}

export function isValibotSchema(schema: any): schema is ValibotSchema | ValibotSchemaAsync | ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any> {
  return '_run' in schema || (typeof schema === 'function' && 'schema' in schema)
}

export function isStandardSchema(schema: any): schema is StandardSchemaV1 {
  return '~standard' in schema
}

export async function validateStandarSchema(
  state: any,
  schema: StandardSchemaV1
): Promise<ValidateReturnSchema<typeof state>> {
  const result = await schema['~standard'].validate({
    value: state
  })

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

async function validateZodSchema(
  state: any,
  schema: ZodSchema
): Promise<ValidateReturnSchema<typeof state>> {
  const result = await schema.safeParseAsync(state)
  if (result.success === false) {
    const errors = result.error.issues.map(issue => ({
      name: issue.path.join('.'),
      message: issue.message
    }))

    return {
      errors,
      result: null
    }
  }
  return {
    result: result.data,
    errors: null
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

async function validateValibotSchema(
  state: any,
  schema: ValibotSchema | ValibotSchemaAsync | ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any>
): Promise<ValidateReturnSchema<typeof state>> {
  const result = await ('_run' in schema ? schema._run({ typed: false, value: state }, {}) : schema(state))

  if (!result.issues || result.issues.length === 0) {
    const output = ('output' in result
      ? result.output
      : 'value' in result
        ? result.value
        : null)
    return {
      errors: null,
      result: output
    }
  }

  const errors = result.issues.map(issue => ({
    name: issue.path?.map((item: any) => item.key).join('.') || '',
    message: issue.message
  }))

  return {
    errors,
    result: null
  }
}

export function parseSchema<T extends object>(state: T, schema: FormSchema<T>): Promise<ValidateReturnSchema<typeof state>> {
  if (isZodSchema(schema)) {
    return validateZodSchema(state, schema)
  } else if (isJoiSchema(schema)) {
    return validateJoiSchema(state, schema)
  } else if (isValibotSchema(schema)) {
    return validateValibotSchema(state, schema)
  } else if (isYupSchema(schema)) {
    return validateYupSchema(state, schema)
  } else if (isSuperStructSchema(schema)) {
    return validateSuperstructSchema(state, schema)
  } else if (isStandardSchema(schema)) {
    return validateStandarSchema(state, schema)
  } else {
    throw new Error('Form validation failed: Unsupported form schema')
  }
}
