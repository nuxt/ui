import { provide, ref, type PropType, h, defineComponent } from 'vue'
import { useEventBus } from '@vueuse/core'
import type { ZodSchema } from 'zod'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type {
  ObjectSchema as YupObjectSchema,
  ValidationError as YupError
} from 'yup'
import type { FormError, FormEvent } from '../../types'

export default defineComponent({
  props: {
    schema: {
      type: Object as
        | PropType<ZodSchema>
        | PropType<YupObjectSchema<any>>
        | PropType<JoiSchema>,
      default: undefined
    },
    state: {
      type: Object,
      required: true
    },
    validate: {
      type: Function as
        | PropType<(state: any) => Promise<FormError[]>>
        | PropType<(state: any) => FormError[]>,
      default: () => []
    }
  },
  setup (props, { slots, expose }) {
    const seed = Math.random().toString(36).substring(7)
    const bus = useEventBus<FormEvent>(`form-${seed}`)

    bus.on(async (event) => {
      if (event.type === 'blur') {
        const otherErrors = errors.value.filter(
          (error) => error.path !== event.path
        )
        const pathErrors = (await getErrors()).filter(
          (error) => error.path === event.path
        )
        errors.value = otherErrors.concat(pathErrors)
      }
    })

    const errors = ref<FormError[]>([])
    provide('form-errors', errors)
    provide('form-events', bus)

    async function getErrors (): Promise<FormError[]> {
      let errs = await props.validate(props.state)

      if (props.schema) {
        if (isZodSchema(props.schema)) {
          errs = errs.concat(await getZodErrors(props.state, props.schema))
        } else if (isYupSchema(props.schema)) {
          errs = errs.concat(await getYupErrors(props.state, props.schema))
        } else if (isJoiSchema(props.schema)) {
          errs = errs.concat(await getJoiErrors(props.state, props.schema))
        } else {
          throw new Error('Form validation failed: Unsupported form schema')
        }
      }

      return errs
    }

    async function validate () {
      errors.value = await getErrors()
      if (errors.value.length > 0) {
        throw new Error(
          `Form validation failed: ${JSON.stringify(errors.value, null, 2)}`
        )
      }

      return props.state
    }

    expose({
      validate
    })

    return () => h('form', slots.default?.())
  }
})

function isYupSchema (schema: any): schema is YupObjectSchema<any> {
  return schema.validate && schema.__isYupSchema__
}

function isYupError (error: any): error is YupError {
  return error.inner !== undefined
}

async function getYupErrors (
  state: any,
  schema: YupObjectSchema<any>
): Promise<FormError[]> {
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
  return schema.parse !== undefined
}

async function getZodErrors (
  state: any,
  schema: ZodSchema
): Promise<FormError[]> {
  const result = await schema.safeParseAsync(state)
  if (result.success === false) {
    return result.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message
    }))
  }
  return []
}

function isJoiSchema (schema: any): schema is JoiSchema {
  return schema.validateAsync !== undefined && schema.id !== undefined
}

function isJoiError (error: any): error is JoiError {
  return error.isJoi === true
}

async function getJoiErrors (
  state: any,
  schema: JoiSchema
): Promise<FormError[]> {
  try {
    await schema.validateAsync(state, { abortEarly: false })
    return []
  } catch (error) {
    if (isJoiError(error)) {
      return error.details.map((detail) => ({
        path: detail.path.join('.'),
        message: detail.message
      }))
    } else {
      throw error
    }
  }
}
