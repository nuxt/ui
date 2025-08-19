import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema, ValidationError as YupError } from 'yup'
import type { Struct } from 'superstruct'
import type z from 'zod'
import type { FormSchema, ValidateReturnSchema } from '../types/form'
import { cloneObject as clone } from './index'

export function isYupSchema(schema: any): schema is YupObjectSchema<any> {
  return schema.validate && schema.__isYupSchema__
}

export function isYupError(error: any): error is YupError {
  return error.inner !== undefined
}

export function isZodSchema(schema: any): schema is z.ZodType<any, any, any> {
  // Zod's fingerprint is the `_def` property
  return (
    typeof schema === 'object'
    && schema !== null
    && typeof schema._def === 'object'
  )
}

export function isValibotSchema(schema: any): boolean {
  return (
    typeof schema === 'object'
    && schema !== null
    && typeof schema._parse === 'function'
    && typeof schema.async === 'boolean'
    && Array.isArray(schema.pipe)
  )
}
interface ZodDefWithShape {
  typeName?: string
  type?: string
  shape?: Record<string, z.ZodType> | (() => Record<string, z.ZodType>)
  items?: z.ZodType[]
  values?: unknown[]
  entries?: Record<string, unknown>
  options?: z.ZodType[] | Map<string, z.ZodType>
  left?: z.ZodType
  right?: z.ZodType
  innerType?: z.ZodType
  base?: z.ZodType
  schema?: z.ZodType
  in?: z.ZodType
  out?: z.ZodType
  output?: z.ZodType
  returns?: z.ZodType
  getter?: () => z.ZodType
  cls?: new (...args: unknown[]) => unknown
  class?: new (...args: unknown[]) => unknown
  value?: unknown
  defaultValue?: unknown | (() => unknown)
  catchValue?: unknown | ((ctx: { error: Error }) => unknown)
  checks?: Array<{
    kind?: string
    format?: string
    value?: number
    _zod?: { def?: { check?: string, value?: number } }
    constructor?: { name?: string }
  }>
  parts?: (string | number | z.ZodType)[]
  minValue?: number
  maxValue?: number
  coerce?: boolean
}

// Credits: https://github.com/toiroakr/zod-empty/
// https://github.com/toiroakr/zod-empty/blob/d421d309fd5d8db1b0196d0733cb43292cfbc141/src/index.ts#L40-L283
export function createStateFromZodSchema<T extends z.ZodType>(schema: T): z.output<T> {
  const def = (schema.def
    || (schema as z.ZodType & { def?: ZodDefWithShape }).def) as ZodDefWithShape

  switch (def.typeName || def.type) {
    case 'object': {
      const outputObject: Record<string, unknown> = {}
      const shape = typeof def.shape === 'function' ? def.shape() : def.shape
      for (const [key, value] of Object.entries(
        shape as Record<string, z.ZodType>
      )) {
        if (value) outputObject[key] = createStateFromZodSchema(value as z.ZodType)
      }
      return outputObject as z.output<T>
    }
    case 'record':
      return {} as z.output<T>
    case 'string': {
      if (def.checks) {
        for (const check of def.checks || []) {
          if (check.format === 'uuid') {
            return crypto.randomUUID() as z.output<T>
          }
          // Handle IP address formats
          if (check.format === 'ipv4') {
            return '0.0.0.0' as z.output<T>
          }
          if (check.format === 'ipv6') {
            return '::' as z.output<T>
          }
        }
      }
      return '' as z.output<T>
    }
    case 'number':
      // Look at checks in order to return the first constraint value
      for (const check of def.checks || []) {
        if (
          check._zod?.def
          && ['greater_than', 'less_than'].includes(check._zod?.def?.check ?? '')
        ) {
          return check._zod.def.value as z.output<T>
        }
      }
      return 0 as z.output<T>
    case 'bigint':
      return BigInt(0) as z.output<T>
    case 'boolean':
      return false as z.output<T>
    case 'date':
      return new Date() as z.output<T>
    case 'literal':
      return def.values?.[0] as z.output<T>
    case 'pipe': {
      // In v4, pipes need to run through the transformation
      const pipeInput = def.in ? createStateFromZodSchema(def.in) : undefined
      if (pipeInput !== undefined) {
        try {
          return schema.parse(pipeInput) as z.output<T>
        } catch {
          return pipeInput as z.output<T>
        }
      }
      return null as z.output<T>
    }
    case 'array':
      return [] as z.output<T>
    case 'tuple':
      return (def.items || []).map((item: z.ZodType) =>
        createStateFromZodSchema(item)
      ) as z.output<T>
    case 'set':
      return new Set() as z.output<T>
    case 'map':
      return new Map() as z.output<T>
    case 'enum':
      if (def.entries) {
        const entries = def.entries
        const values = Object.values(entries as Record<string, unknown>)
        const hasNumericValues = values.some(v => typeof v === 'number')
        if (hasNumericValues) {
          // This is a native enum - return the first numeric value
          return values.filter(
            value =>
              typeof (entries as Record<string, unknown>)[
                value as string | number
              ] !== 'number'
          )[0] as z.output<T>
        }
        // This is a regular enum - return the first value
        return values[0] as z.output<T>
      }
      return null as z.output<T>
    case 'union': {
      const options = def.options as z.ZodType[] | undefined
      return (options?.[0] ? createStateFromZodSchema(options[0]) : undefined) as z.output<T>
    }
    case 'intersection': {
      const left = def.left ? createStateFromZodSchema(def.left) : {}
      const right = def.right ? createStateFromZodSchema(def.right) : {}
      return Object.assign(
        left as Record<string, unknown>,
        right
      ) as z.output<T>
    }
    case 'function':
      return ((..._: unknown[]) => {
        const returnType = def.returns || def.output
        return returnType ? createStateFromZodSchema(returnType) : undefined
      }) as z.output<T>
    case 'lazy': {
      const lazyType = def.getter ? def.getter() : def.innerType || def.base
      return (lazyType ? createStateFromZodSchema(lazyType) : undefined) as z.output<T>
    }
    case 'pipeline': {
      // For pipelines, we need to actually run through the pipeline
      // to get the final transformed result
      const input = def.in ? createStateFromZodSchema(def.in) : undefined
      try {
        return schema.parse(input) as z.output<T>
      } catch {
        return input as z.output<T>
      }
    }
    case 'default': {
      const defaultInnerType = def.innerType || def.base
      const innerDef
        = defaultInnerType?.def
          || (defaultInnerType as z.ZodType & { def?: ZodDefWithShape })?.def
      const isFunction
        = (innerDef as ZodDefWithShape)?.typeName === 'ZodFunction'
          || (innerDef as ZodDefWithShape)?.type === 'function'
      // In v4, defaultValue is a getter property, not a function
      const defaultValue
        = typeof def.defaultValue === 'function'
          ? def.defaultValue()
          : def.defaultValue
      return (isFunction ? defaultValue : clone(defaultValue)) as z.output<T>
    }
    case 'nan':
      return Number.NaN as z.output<T>
    case 'null':
    case 'any':
      return null as z.output<T>
    case 'optional': {
      // For optional types, we need to check if it's nullish (optional(nullable))
      // and if the deepest type has coerce
      const innerOptional = def.innerType || def.base
      if (innerOptional) {
        return createStateFromZodSchema(innerOptional) as z.output<T>
      }
      return null as z.output<T>
    }
    case 'nullable': {
      // If the inner type has coerce, we should use it instead of returning null
      const innerTypeForNullable = def.innerType || def.base
      if (innerTypeForNullable) {
        const innerDefForNullable
          = innerTypeForNullable._def
            || (innerTypeForNullable as z.ZodType & { def?: ZodDefWithShape }).def
        if (
          innerDefForNullable
          && 'coerce' in innerDefForNullable
          && innerDefForNullable.coerce
        ) {
          return createStateFromZodSchema(innerTypeForNullable) as z.output<T>
        }
      }
      // For nullable without coerce, return null
      return null as z.output<T>
    }
    case 'undefined':
    case 'void':
    case 'never':
      return null as z.output<T>
    case 'unknown':
      return null as z.output<T>
    case 'symbol':
      return null as z.output<T>
    case 'file':
      // Return a minimal File object
      if (typeof File !== 'undefined') {
        return new File([], 'empty.txt', { type: 'text/plain' }) as z.output<T>
      }
      return null as z.output<T>
    case 'instanceof': {
      // For instanceof checks, try to create a minimal instance
      const cls = def.cls || def.class
      if (cls === File && typeof File !== 'undefined') {
        return new File([], 'empty.txt', { type: 'text/plain' }) as z.output<T>
      }
      // For other classes, return null
      return null as z.output<T>
    }
    case 'branded': {
      // For branded types, get the value from the underlying type
      const brandedType = def.type || def.base
      return (
        brandedType && typeof brandedType !== 'string'
          ? createStateFromZodSchema(brandedType)
          : undefined
      ) as z.output<T>
    }
    case 'catch':
      // For catch types, try to get the value from the inner type
      // If it fails, use the catch value
      try {
        const innerType = def.innerType || def.base
        const innerValue = innerType ? createStateFromZodSchema(innerType) : undefined
        return schema.parse(innerValue) as z.output<T>
      } catch {
        // Get the catch value
        const catchValue
          = typeof def.catchValue === 'function'
            // eslint-disable-next-line unicorn/error-message
            ? def.catchValue({ error: new Error() })
            : def.catchValue
        return catchValue as z.output<T>
      }
    case 'template_literal':
      // For template literals, concatenate parts
      if (def.parts) {
        return (def.parts as (string | number | z.ZodType)[])
          .map((part) => {
            if (typeof part === 'string' || typeof part === 'number') {
              return part
            }
            // For schema parts, createStateFromZodSchema with empty string
            return ''
          })
          .join('') as z.output<T>
      }
      return '' as z.output<T>
    case 'readonly': {
      // For readonly, createStateFromZodSchema the inner type
      const readonlyInner = def.innerType || def.base
      return (readonlyInner ? createStateFromZodSchema(readonlyInner) : undefined) as z.output<T>
    }
    case 'custom': {
      return null as z.output<T>
    }
    default:
      return undefined as unknown as z.output<T>
  }
}
export function createState(schema: any): unknown {
  if (isZodSchema(schema)) {
    return createStateFromZodSchema(schema)
  } else if (isYupSchema(schema)) {
    return schema.getDefault()
  } else if (isValibotSchema(schema)) {
    return schema.getDefaults()
  }

  return {}
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
