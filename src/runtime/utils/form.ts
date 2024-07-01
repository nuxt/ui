import type { ZodSchema } from 'zod'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema, ValidationError as YupError } from 'yup'
import type { GenericSchema as ValibotSchema, GenericSchemaAsync as ValibotSchemaAsync, SafeParser as ValibotSafeParser, SafeParserAsync as ValibotSafeParserAsync } from 'valibot'
import type { FormError } from '../types/form'

export function isYupSchema(schema: any): schema is YupObjectSchema<any> {
  return schema.validate && schema.__isYupSchema__
}

export function isYupError(error: any): error is YupError {
  return error.inner !== undefined
}

export async function getYupErrors(state: any, schema: YupObjectSchema<any>): Promise<FormError[]> {
  try {
    await schema.validate(state, { abortEarly: false })
    return []
  } catch (error) {
    if (isYupError(error)) {
      return error.inner.map(issue => ({
        name: issue.path ?? '',
        message: issue.message
      }))
    } else {
      throw error
    }
  }
}

export function isZodSchema(schema: any): schema is ZodSchema {
  return schema.parse !== undefined
}

export async function getZodErrors(state: any, schema: ZodSchema): Promise<FormError[]> {
  const result = await schema.safeParseAsync(state)
  if (result.success === false) {
    return result.error.issues.map(issue => ({
      name: issue.path.join('.'),
      message: issue.message
    }))
  }
  return []
}

export function isJoiSchema(schema: any): schema is JoiSchema {
  return schema.validateAsync !== undefined && schema.id !== undefined
}

export function isJoiError(error: any): error is JoiError {
  return error.isJoi === true
}

export async function getJoiErrors(state: any, schema: JoiSchema): Promise<FormError[]> {
  try {
    await schema.validateAsync(state, { abortEarly: false })
    return []
  } catch (error) {
    if (isJoiError(error)) {
      return error.details.map(detail => ({
        name: detail.path.join('.'),
        message: detail.message
      }))
    } else {
      throw error
    }
  }
}

export function isValibotSchema(schema: any): schema is ValibotSchema | ValibotSchemaAsync | ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any> {
  return '_run' in schema || (typeof schema === 'function' && 'schema' in schema)
}

export async function getValibotError(
  state: any,
  schema: ValibotSchema | ValibotSchemaAsync | ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any>
): Promise<FormError[]> {
  const result = await ('_run' in schema ? schema._run({ typed: false, value: state }, {}) : schema(state))
  return result.issues?.map(issue => ({
    // We know that the key for a form schema is always a string or a number
    name: issue.path?.map((item: any) => item.key).join('.') || '',
    message: issue.message
  })) || []
}
