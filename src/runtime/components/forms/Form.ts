import { provide, ref, PropType, h } from 'vue'
import { FormError } from '../../types'

import type { ZodSchema, ZodError } from 'zod'
import type { ObjectSchema, ValidationError } from 'yup'

function isZodSchema (schema: any): schema is ZodSchema {
  return schema?.constructor.name === 'ZodObject' && schema.parse !== undefined
}

function isZodError (error: any): error is ZodError {
  return error?.constructor.name === 'ZodError' && error.issues !== undefined
}

function isYupSchema (schema: any): schema is ObjectSchema<any> {
  return schema?.constructor.name === 'ObjectSchema' && schema.validate !== undefined
}

function isYupError (error: any): error is ValidationError {
  return error?.constructor.name === 'ValidationError' && error.inner !== undefined
}

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<ZodSchema> | PropType<ObjectSchema<any>>,
      default: undefined
    },
    // Could be usefull later to watch for changes
    state: {
      type: Object as PropType<ZodSchema>,
      required: true
    },

    validate: {
      type: Function as PropType<(state: any) => Promise<FormError[]>>,
      default: () => []
    }
  },

  setup (props, { slots, expose }) {
    const errors = ref<FormError[]>([])
    provide('form-errors', errors)

    async function getErrors (state: any, schema: ZodSchema | ObjectSchema<any>): Promise<FormError[]>{
      if (isZodSchema(schema)) {
        return getZodErrors(state, schema)
      } else if (isYupSchema(schema)) {
        return getYupErrors(state, schema)
      } else {
        throw new Error('Unsupported schema type')
      }
    }

    async function getZodErrors (state: any, schema: ZodSchema): Promise<FormError[]> {
      try {
        schema.parse(state)
        return []
      } catch (error) {
        if (isZodError(error)) {
          return error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        } else {
          throw error
        }
      }
    }

    async function getYupErrors (state: any, schema: ObjectSchema<any>): Promise<FormError[]> {
      try {
        await schema.validate(state, { abortEarly: false })
        return []
      } catch (error) {
        if (isYupError(error)) {
          return error.inner.map((issue) => ({
            path: issue.path ?? '',
            message: issue.message
          }))
        } else {
          throw error
        }
      }
    }

    async function validate () {
      let errs = await props.validate(props.state)
      if (props.schema) {
        errs = errs.concat(await getErrors(props.state, props.schema))
      }
      errors.value = errs

      if (errors.value.length > 0) {
        throw new Error(`Form Validation error: ${JSON.stringify(errs, null, 2)}`)
      }
    }

    expose({
      validate
    })

    return () => h('form', slots.default?.())
  }
})
