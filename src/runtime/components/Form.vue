<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/form'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, FormEvent, Form, FormErrorWithId } from '../types/form'

const appConfig = _appConfig as AppConfig & { ui: { form: Partial<typeof theme> } }

const form = tv({ extend: tv(theme), ...(appConfig.ui?.form || {}) })

export interface FormProps<T extends object> {
  id?: string | number
  schema?: FormSchema<T>
  state: Partial<T>
  validate?: (state: Partial<T>) => Promise<FormError[]> | FormError[]
  validateOn?: FormInputEvents[]
  disabled?: boolean
  validateOnInputDelay?: number
  class?: any
  onSubmit?: ((event: FormSubmitEvent<T>) => void | Promise<void>) | (() => void | Promise<void>)
}

export interface FormEmits<T extends object> {
  (e: 'submit', payload: FormSubmitEvent<T>): void
  (e: 'error', payload: FormErrorEvent): void
}

export interface FormSlots {
  default(props?: {}): any
}

extendDevtoolsMeta({ example: 'FormExample' })
</script>

<script lang="ts" setup generic="T extends object">
import { provide, inject, nextTick, ref, onUnmounted, onMounted, computed, useId, readonly } from 'vue'
import { useEventBus } from '@vueuse/core'
import { formOptionsInjectionKey, formInputsInjectionKey, formBusInjectionKey, formLoadingInjectionKey } from '../composables/useFormField'
import { parseSchema } from '../utils/form'
import { FormValidationException } from '../types/form'

const props = withDefaults(defineProps<FormProps<T>>(), {
  validateOn() {
    return ['input', 'blur', 'change'] as FormInputEvents[]
  },
  validateOnInputDelay: 300
})
const emits = defineEmits<FormEmits<T>>()
defineSlots<FormSlots>()

const formId = props.id ?? useId() as string

const bus = useEventBus<FormEvent>(`form-${formId}`)
const parentBus = inject(
  formBusInjectionKey,
  undefined
)

provide(formBusInjectionKey, bus)

const nestedForms = ref<Map<string | number, { validate: () => any }>>(new Map())

onMounted(async () => {
  bus.on(async (event) => {
    if (event.type === 'attach') {
      nestedForms.value.set(event.formId, { validate: event.validate })
    } else if (event.type === 'detach') {
      nestedForms.value.delete(event.formId)
    } else if (props.validateOn?.includes(event.type as FormInputEvents)) {
      await _validate({ name: event.name, silent: true, nested: false })
    }
  })
})

onUnmounted(() => {
  bus.reset()
})

onMounted(async () => {
  if (parentBus) {
    await nextTick()
    parentBus.emit({ type: 'attach', validate: _validate, formId })
  }
})

onUnmounted(() => {
  if (parentBus) {
    parentBus.emit({ type: 'detach', formId })
  }
})

const errors = ref<FormErrorWithId[]>([])
provide('form-errors', errors)

const inputs = ref<Record<string, { id?: string, pattern?: RegExp }>>({})
provide(formInputsInjectionKey, inputs)

function resolveErrorIds(errs: FormError[]): FormErrorWithId[] {
  return errs.map(err => ({
    ...err,
    id: inputs.value[err.name]?.id
  }))
}

const parsedValue = ref<T | null>(null)
async function getErrors(): Promise<FormErrorWithId[]> {
  let errs = props.validate ? (await props.validate(props.state)) ?? [] : []

  if (props.schema) {
    const { errors, result } = await parseSchema(props.state, props.schema as FormSchema<typeof props.state>)
    if (errors) {
      errs = errs.concat(errors)
    } else {
      parsedValue.value = result
    }
  }

  return resolveErrorIds(errs)
}

async function _validate(opts: { name?: string | string[], silent?: boolean, nested?: boolean } = { silent: false, nested: true }): Promise<T | false> {
  const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name as string[]

  const nestedValidatePromises = !names && opts.nested
    ? Array.from(nestedForms.value.values()).map(
      ({ validate }) => validate().then(() => undefined).catch((error: Error) => {
        if (!(error instanceof FormValidationException)) {
          throw error
        }
        return error
      })
    )
    : []

  if (names) {
    const otherErrors = errors.value.filter(error => !names.some((name) => {
      const pattern = inputs.value?.[name]?.pattern
      return name === error.name || (pattern && error.name.match(pattern))
    }))

    const pathErrors = (await getErrors()).filter(error => names.some((name) => {
      const pattern = inputs.value?.[name]?.pattern
      return name === error.name || (pattern && error.name.match(pattern))
    }))

    errors.value = otherErrors.concat(pathErrors)
  } else {
    errors.value = await getErrors()
  }

  const childErrors = (await Promise.all(nestedValidatePromises)).filter(val => val)

  if (errors.value.length + childErrors.length > 0) {
    if (opts.silent) return false
    throw new FormValidationException(formId, errors.value, childErrors)
  }

  return props.state as T
}

const loading = ref(false)
provide(formLoadingInjectionKey, readonly(loading))

async function onSubmitWrapper(payload: Event) {
  loading.value = true

  const event = payload as FormSubmitEvent<any>

  try {
    await _validate({ nested: true })
    event.data = props.schema ? parsedValue.value : props.state
    await props.onSubmit?.(event)
  } catch (error) {
    if (!(error instanceof FormValidationException)) {
      throw error
    }

    const errorEvent: FormErrorEvent = {
      ...event,
      errors: error.errors,
      childrens: error.childrens
    }
    emits('error', errorEvent)
  }

  loading.value = false
}

const disabled = computed(() => props.disabled || loading.value)

provide(formOptionsInjectionKey, computed(() => ({
  disabled: disabled.value,
  validateOnInputDelay: props.validateOnInputDelay
})))

defineExpose<Form<T>>({
  validate: _validate,
  errors,

  setErrors(errs: FormError[], name?: string) {
    if (name) {
      errors.value = errors.value
        .filter(error => error.name !== name)
        .concat(resolveErrorIds(errs))
    } else {
      errors.value = resolveErrorIds(errs)
    }
  },

  async submit() {
    await onSubmitWrapper(new Event('submit'))
  },

  getErrors(name?: string) {
    if (name) {
      return errors.value.filter(err => err.name === name)
    }
    return errors.value
  },

  clear(name?: string) {
    if (name) {
      errors.value = errors.value.filter(err => err.name !== name)
    } else {
      errors.value = []
    }
  },

  disabled
})
</script>

<template>
  <component
    :is="parentBus ? 'div' : 'form'"
    :id="formId"
    :class="form({ class: props.class })"
    @submit.prevent="onSubmitWrapper"
  >
    <slot />
  </component>
</template>
