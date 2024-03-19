<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/form'
import { getYupErrors, isYupSchema, getValibotError, isValibotSchema, getZodErrors, isZodSchema, getJoiErrors, isJoiSchema } from '../utils/form'
import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, FormEvent, InjectedFormOptions, Form } from '../types/form'

const appConfig = _appConfig as AppConfig & { ui: { form: Partial<typeof theme> } }

const form = tv({ extend: tv(theme), ...(appConfig.ui?.form || {}) })

export interface FormProps<T extends object> {
  schema?: FormSchema<T>
  state: Partial<T>
  validate?: (state: Partial<T>) => Promise<FormError[] | void>
  validateOn?: FormInputEvents[]
  disabled?: boolean
  validateOnInputDelay?: number
  class?: any
}

export interface FormEmits<T extends object> {
  (e: 'submit', payload: FormSubmitEvent<T>): void
  (e: 'error', payload: FormErrorEvent): void
}

export interface FormSlots {
  default(): any
}

export class FormException extends Error {
  constructor (message: string) {
    super(message)
    this.message = message
    Object.setPrototypeOf(this, FormException.prototype)
  }
}
</script>

<script lang="ts" setup generic="T extends object">
import { provide, ref, onUnmounted, onMounted, computed } from 'vue'
import { useEventBus } from '@vueuse/core'
import { useId } from '#imports'

const props = withDefaults(defineProps<FormProps<T>>(), {
  validateOn () {
    return ['input', 'blur', 'change'] as FormInputEvents[]
  },
  validateOnInputDelay: 300
})
const emit = defineEmits<FormEmits<T>>()
defineSlots<FormSlots>()

const formId = useId()
const bus = useEventBus<FormEvent>(`form-${formId}`)

onMounted(() => {
  bus.on(async (event) => {
    if (
      event.type !== 'submit' &&
      props.validateOn?.includes(event.type as FormInputEvents)
    ) {
      await _validate(event.name, { silent: true })
    }
  })
})

onUnmounted(() => {
  bus.reset()
})

const options = {
  disabled: computed(() => props.disabled),
  validateOnInputDelay: computed(() => props.validateOnInputDelay)
}
provide<InjectedFormOptions>('form-options', options)

const errors = ref<FormError[]>([])
provide('form-errors', errors)
provide('form-events', bus)
const inputs = ref<Record<string, string>>({})
provide('form-inputs', inputs)

async function getErrors (): Promise<FormError[]> {
  let errs = props.validate ? (await props.validate(props.state)) ?? [] : []
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

async function _validate (
  name?: string | string[],
  opts: { silent?: boolean } = { silent: false }
): Promise<T | false> {
  let paths = name
  if (name && !Array.isArray(name)) {
    paths = [name]
  }

  if (paths) {
    const otherErrors = errors.value.filter(
      (error) => !paths!.includes(error.name)
    )
    const pathErrors = (await getErrors()).filter((error) =>
      paths!.includes(error.name)
    )
    errors.value = otherErrors.concat(pathErrors)
  } else {
    errors.value = await getErrors()
  }

  if (errors.value.length > 0) {
    if (opts.silent) return false

    throw new FormException(`Form validation failed: ${JSON.stringify(errors.value, null, 2)}`)
  }

  return props.state as T
}

async function onSubmit (payload: Event) {
  const event = payload as SubmitEvent
  try {
    await _validate()
    const submitEvent: FormSubmitEvent<any> = {
      ...event,
      data: props.state
    }
    emit('submit', submitEvent)
  } catch (error) {
    if (!(error instanceof FormException)) {
      throw error
    }

    const errorEvent: FormErrorEvent = {
      ...event,
      errors: errors.value.map((err) => ({
        ...err,
        id: inputs.value[err.name]
      }))
    }
    emit('error', errorEvent)
  }
}

defineExpose<Form<T>>({
  validate: _validate,
  errors,
  setErrors (errs: FormError[], name?: string) {
    errors.value = errs
    if (name) {
      errors.value = errors.value
        .filter((error) => error.name !== name)
        .concat(errs)
    } else {
      errors.value = errs
    }
  },
  async submit () {
    await onSubmit(new Event('submit'))
  },
  getErrors (name?: string) {
    if (name) {
      return errors.value.filter((err) => err.name === name)
    }
    return errors.value
  },
  clear (name?: string) {
    if (name) {
      errors.value = errors.value.filter((err) => err.name !== name)
    } else {
      errors.value = []
    }
  },
  ...options
})
</script>

<template>
  <form :class="form({ class: props.class })" @submit.prevent="onSubmit">
    <slot />
  </form>
</template>
