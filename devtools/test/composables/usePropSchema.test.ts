// @vitest-environment node
import { it, expect, describe } from 'vitest'
import { usePropSchema } from '../../app/composables/usePropSchema'
import { stringSchema, optionalStringSchema, booleanSchema, numberSchema, optionalNumberSchema, optionalBooleanSchema, objectSchema, arraySchema, arrayOptionalSchema, stringEnumSchema } from '../fixtures/schemas'

describe('usePropSchema', () => {
  const { resolveInputSchema } = usePropSchema()

  it.each([
    ['string', { schema: stringSchema, inputId: 'string' }],
    ['optional string', { schema: optionalStringSchema, inputId: 'string' }],
    ['number', { schema: numberSchema, inputId: 'number' }],
    ['optional number', { schema: optionalNumberSchema, inputId: 'number' }],
    ['boolean', { schema: booleanSchema, inputId: 'boolean' }],
    ['string enum', { schema: stringEnumSchema, inputId: 'stringEnum' }],
    ['object', { schema: objectSchema, inputId: 'object' }],
    ['optional boolean', { schema: optionalBooleanSchema, inputId: 'boolean' }],
    ['array', { schema: arraySchema, inputId: 'array' }],
    ['optional array', { schema: arrayOptionalSchema, inputId: 'array' }]
  ])('resolveInputSchema should resolve %s schema', async (_: string, options) => {
    const result = resolveInputSchema(options.schema as any)
    expect(result?.input.id).toBe(options.inputId)
  })
})
