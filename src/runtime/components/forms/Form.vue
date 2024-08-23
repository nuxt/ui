<template>
  <form @submit.prevent="onSubmit">
    <slot />
  </form>
</template>

<script lang="ts">
import { provide, ref, type PropType, defineComponent, onUnmounted, onMounted } from 'vue'
import { useEventBus } from '@vueuse/core'
import type { ZodSchema } from 'zod'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema, ValidationError as YupError } from 'yup'
import type { BaseSchema as ValibotSchema30, BaseSchemaAsync as ValibotSchemaAsync30 } from 'valibot30'
import type { GenericSchema as ValibotSchema31, GenericSchemaAsync as ValibotSchemaAsync31, SafeParser as ValibotSafeParser31, SafeParserAsync as ValibotSafeParserAsync31 } from 'valibot31'
import type { GenericSchema as ValibotSchema, GenericSchemaAsync as ValibotSchemaAsync, SafeParser as ValibotSafeParser, SafeParserAsync as ValibotSafeParserAsync } from 'valibot'
import type { FormError, FormEvent, FormEventType, FormSubmitEvent, FormErrorEvent, Form } from '../../types/form'
import { useId } from '#imports'

class FormException extends Error {
  constructor (message: string) {
    super(message)
    this.message = message
    Object.setPrototypeOf(this, FormException.prototype)
  }
}

export default defineComponent({
  props: {
    schema: {
      type: [Object, Function] as
        | PropType<ZodSchema>
        | PropType<YupObjectSchema<any>>
        | PropType<JoiSchema>
        | PropType<ValibotSchema30 | ValibotSchemaAsync30>
        | PropType<ValibotSchema31 | ValibotSchemaAsync31>
        | PropType<ValibotSafeParser31<any, any> | ValibotSafeParserAsync31<any, any>>
        | PropType<ValibotSchema | ValibotSchemaAsync>
        | PropType<ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any>>,
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
    },
    validateOn: {
      type: Array as PropType<FormEventType[]>,
      default: () => ['blur', 'input', 'change', 'submit']
    }
  },
  emits: ['submit', 'error'],
  setup (props, { expose, emit }) {
    const formId = useId()
    const bus = useEventBus<FormEvent>(`form-${formId}`)

    onMounted(() => {
      bus.on(async (event) => {
        if (event.type !== 'submit' && props.validateOn?.includes(event.type)) {
          await validate(event.path, { silent: true })
        }
      })
    })

    onUnmounted(() => {
      bus.reset()
    })

    const errors = ref<FormError[]>([])
    provide('form-errors', errors)
    provide('form-events', bus)
    const inputs = ref({})
    provide('form-inputs', inputs)

    async function getErrors (): Promise<FormError[]> {
      let errs = await props.validate(props.state)

      if (props.schema) {
        if (isZodSchema(props.schema)) {
          errs = errs.concat(await getZodErrors(props.state, props.schema))
        } else if (isYupSchema(props.schema)) {
          errs = errs.concat(await getYupErrors(props.state, props.schema))
        } else if (isJoiSchema(props.schema)) {
          errs = errs.concat(await getJoiErrors(props.state, props.schema))
        } else if (isValibotSchema(props.schema)) {
          errs = errs.concat(await getValibotError(props.state, props.schema))
        } else {
          throw new Error('Form validation failed: Unsupported form schema')
        }
      }

      return errs
    }

    async function validate (path?: string | string[], opts: { silent?: boolean } = { silent: false }) {
      let paths = path

      if (path && !Array.isArray(path)) {
        paths = [path]
      }

      if (paths) {
        const otherErrors = errors.value.filter(
          (error) => !paths.includes(error.path)
        )
        const pathErrors = (await getErrors()).filter(
          (error) => paths.includes(error.path)
        )
        errors.value = otherErrors.concat(pathErrors)
      } else {
        errors.value = await getErrors()
      }

      if (errors.value.length > 0) {
        if (opts.silent) return false

        throw new FormException(
          `Form validation failed: ${JSON.stringify(errors.value, null, 2)}`
        )
      }

      return props.state
    }

    async function onSubmit (payload: Event) {
      const event = payload as FormSubmitEvent<any>
      try {
        if (props.validateOn?.includes('submit')) {
          await validate()
        }
        event.data = props.state
        emit('submit', event)
      } catch (error) {
        if (!(error instanceof FormException)) {
          throw error
        }

        const errorEvent: FormErrorEvent = {
          ...event,
          errors: errors.value.map((err) => ({
            ...err,
            id: inputs.value[err.path]
          }))
        }
        emit('error', errorEvent)
      }
    }

    expose({
      validate,
      errors,
      setErrors (errs: FormError[], path?: string) {
        if (path) {
          errors.value = errors.value.filter(
            (error) => error.path !== path
          ).concat(errs)
        } else {
          errors.value = errs
        }
      },
      async submit () {
        await onSubmit(new Event('submit'))
      },
      getErrors (path?: string) {
        if (path) {
          return errors.value.filter((err) => err.path === path)
        }
        return errors.value
      },
      clear (path?: string) {
        if (path) {
          errors.value = errors.value.filter((err) => err.path !== path)
        } else {
          errors.value = []
        }
      }
    } as Form<any>)

    return {
      onSubmit
    }
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

function isValibotSchema (schema: any): schema is ValibotSchema30 | ValibotSchemaAsync30 | ValibotSchema31 | ValibotSchemaAsync31 | ValibotSafeParser31<any, any> | ValibotSafeParserAsync31<any, any> | ValibotSchema | ValibotSchemaAsync | ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any> {
  return '_parse' in schema || '_run' in schema || (typeof schema === 'function' && 'schema' in schema)
}

async function getValibotError (
  state: any,
  schema: ValibotSchema30 | ValibotSchemaAsync30 | ValibotSchema31 | ValibotSchemaAsync31 | ValibotSafeParser31<any, any> | ValibotSafeParserAsync31<any, any> | ValibotSchema | ValibotSchemaAsync | ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any>
): Promise<FormError[]> {
  const result = await ('_parse' in schema ? schema._parse(state) : '_run' in schema ? schema._run({ typed: false, value: state }, {}) : schema(state))
  return result.issues?.map((issue) => ({
    // We know that the key for a form schema is always a string or a number
    path: issue.path?.map((item) => item.key).join('.') || '',
    message: issue.message
  })) || []
}
</script>
