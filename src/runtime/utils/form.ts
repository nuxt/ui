import type { ZodSchema } from 'zod'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema, ValidationError as YupError } from 'yup'
import type { ObjectSchemaAsync as ValibotObjectSchema } from 'valibot'
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

export function isValibotSchema(schema: any): schema is ValibotObjectSchema<any> {
  return schema._parse !== undefined
}

export async function getValibotError(state: any, schema: ValibotObjectSchema<any>): Promise<FormError[]> {
  const result = await schema._parse(state)
  if (result.issues) {
    return result.issues.map(issue => ({
      name: issue.path?.map(p => p.key).join('.') || '',
      message: issue.message
    }))
  }
  return []
}
