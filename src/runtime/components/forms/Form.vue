<template>
  <form @submit.prevent="onSubmit">
    <slot />
  </form>
</template>

<script lang="ts">
import { provide, ref, type PropType, defineComponent } from 'vue'
import { useEventBus } from '@vueuse/core'
import type { ZodSchema } from 'zod'
import type { ValidationError as JoiError, Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema, ValidationError as YupError } from 'yup'
import type { ObjectSchema as ValibotObjectSchema } from 'valibot'
import type { FormError, FormEvent, FormEventType, FormSubmitEvent, Form } from '../../types/form'

export default defineComponent({
  props: {
    schema: {
      type: Object as
        | PropType<ZodSchema>
        | PropType<YupObjectSchema<any>>
        | PropType<JoiSchema>
        | PropType<ValibotObjectSchema<any>>,
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
  emits: ['submit'],
  setup (props, { expose, emit }) {
    const seed = Math.random().toString(36).substring(7)
    const bus = useEventBus<FormEvent>(`form-${seed}`)

    bus.on(async (event) => {
      if (event.type !== 'submit' && props.validateOn?.includes(event.type)) {
        await validate(event.path, { silent: true })
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
        } else if (isValibotSchema(props.schema)) {
          errs = errs.concat(await getValibotError(props.state, props.schema))
        } else {
          throw new Error('Form validation failed: Unsupported form schema')
        }
      }

      return errs
    }

    async function validate (path?: string, opts: { silent?: boolean } = { silent: false }) {
      if (path) {
        const otherErrors = errors.value.filter(
          (error) => error.path !== path
        )
        const pathErrors = (await getErrors()).filter(
          (error) => error.path === path
        )
        errors.value = otherErrors.concat(pathErrors)
      } else {
        errors.value = await getErrors()
      }

      if (!opts.silent && errors.value.length > 0) {
        throw new Error(
          `Form validation failed: ${JSON.stringify(errors.value, null, 2)}`
        )
      }
      return props.state
    }

    async function onSubmit (event: SubmitEvent) {
      if (props.validateOn?.includes('submit')) {
        await validate()
      }
      const submitEvent = event as FormSubmitEvent<any>
      submitEvent.data = props.state
      emit('submit', event)
    }

    expose({
      validate,
      errors,
      setErrors (errs: FormError[], path?: string) {
        errors.value = errs
        if (path) {
          errors.value = errors.value.filter(
            (error) => error.path !== path
          ).concat(errs)
        } else {
          errors.value = errs
        }
      },
      getErrors (path?: string) {
        if (path) {
          return errors.value.filter((err) => err.path === path)
        }
        return errors.value
      },
      clear (path?: string) {
        if (path) {
          errors.value = errors.value.filter((err) => err.path === path)
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

function isValibotSchema (schema: any): schema is ValibotObjectSchema<any> {
  return schema._parse !== undefined
}

async function getValibotError (
  state: any,
  schema: ValibotObjectSchema<any>
): Promise<FormError[]> {
  const { safeParseAsync } = await import('valibot')

  const result = await safeParseAsync(schema, state)
  if (result.success === false) {
    return result.issues.map((issue) => ({
      path: issue.path.map(p => p.key).join('.'),
      message: issue.message
    }))
  }
  return []
}
</script>
