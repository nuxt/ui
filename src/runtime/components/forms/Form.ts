import { provide, ref, PropType, h } from 'vue'
import { FormError, FormEvent } from '../../types'
import { useEventBus } from '@vueuse/core'

import type { ZodSchema, ZodError } from 'zod'
import type { ObjectSchema, ValidationError } from 'yup'

function isYupSchema (schema: any): schema is ObjectSchema<any> {
  return schema?.constructor.name === 'ObjectSchema' && schema.validate !== undefined
}

function isYupError (error: any): error is ValidationError {
  return error?.constructor.name === 'ValidationError' && error.inner !== undefined
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

function isZodSchema (schema: any): schema is ZodSchema {
  return schema?.constructor.name === 'ZodObject' && schema.parse !== undefined
}

function isZodError (error: any): error is ZodError {
  return error?.constructor.name === 'ZodError' && error.issues !== undefined
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

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<ZodSchema> | PropType<ObjectSchema<any>>,
      default: undefined
    },

    state: {
      type: Object,
      required: true
    },

    validate: {
      type: Function as PropType<(state: any) => Promise<FormError[]>>,
      default: () => []
    }
  },

  setup (props, { slots, expose }) {
    const seed = Math.random().toString(36).substring(7)
    const bus = useEventBus<FormEvent>(`form-${seed}`)

    bus.on(async (event) => {
      if (event.type === 'blur') {
        const otherErrors = errors.value.filter((error) => error.path !== event.path)
        const pathErrors = (await getErrors(props.state, props.schema)).filter((error) => error.path === event.path)
        errors.value = otherErrors.concat(pathErrors)
      }
    })

    const errors = ref<FormError[]>([])
    provide('form-errors', errors)
    provide('form-events', bus)

    async function getErrors (state: any, schema?: ZodSchema | ObjectSchema<any>): Promise<FormError[]>{
      let errs = await props.validate(props.state)

      if (isZodSchema(schema)) {
        errs = errs.concat(await getZodErrors(state, schema))
      } else if (isYupSchema(schema)) {
        errs = errs.concat(await getYupErrors(state, schema))
      }

      return errs
    }

    async function validate () {
      errors.value = await getErrors(props.state, props.schema)
      if (errors.value.length > 0) {
        throw new Error(`Form Validation error: ${JSON.stringify(errors.value, null, 2)}`)
      }
    }

    expose({
      validate
    })

    return () => h('form', slots.default?.())
  }
})
