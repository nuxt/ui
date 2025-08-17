<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form'
import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, FormEvent, Form, InferInput, FormData, FormValidationException } from '../types/form'
import type { ComponentConfig } from '../types/utils'
import { useForm } from '../composables/useForm'

type FormConfig = ComponentConfig<typeof theme, AppConfig, 'form'>

export interface FormProps<S extends FormSchema, T extends boolean = true> {
  id?: string | number
  /** Schema to validate the form state. Supports Standard Schema objects, Yup, Joi, and Superstructs. */
  schema?: S
  /** An object representing the current state of the form. */
  state: Partial<InferInput<S>>
  /**
   * Custom validation function to validate the form state.
   * @param state - The current state of the form.
   * @returns A promise that resolves to an array of FormError objects, or an array of FormError objects directly.
   */
  validate?: (state: Partial<InferInput<S>>) => Promise<FormError[]> | FormError[]
  /**
   * The list of input events that trigger the form validation.
   * @remarks The form always validates on submit.
   * @defaultValue `['blur', 'change', 'input']`
   */
  validateOn?: FormInputEvents[]
  /** Disable all inputs inside the form. */
  disabled?: boolean
  /**
   * Delay in milliseconds before validating the form on input events.
   * @defaultValue `300`
   */
  validateOnInputDelay?: number
  /**
   * If true, schema transformations will be applied to the state on submit.
   * @defaultValue `true`
   */
  transform?: T

  /**
   * If true, this form will attach to its parent Form (if any) and validate at the same time.
   * @defaultValue `true`
   */
  attach?: boolean

  /**
   * When `true`, all form elements will be disabled on `@submit` event.
   * This will cause any focused input elements to lose their focus state.
   * @defaultValue `true`
   */
  loadingAuto?: boolean
  class?: any
  onSubmit?: ((event: FormSubmitEvent<FormData<S, T>>) => void | Promise<void>) | (() => void | Promise<void>)
}

export interface FormEmits<S extends FormSchema, T extends boolean = true> {
  submit: [payload: FormSubmitEvent<FormData<S, T>>]
  error: [payload: FormErrorEvent]
}

export interface FormSlots {
  default(props: { errors: FormError[], loading: boolean }): any
}
</script>

<script lang="ts" setup generic="S extends FormSchema, T extends boolean = true">
import { provide, inject, nextTick, onUnmounted, onMounted, computed, useId, readonly } from 'vue'
import { useEventBus } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { formBusInjectionKey } from '../composables/useFormField'
import { tv } from '../utils/tv'

type I = InferInput<S>

const props = withDefaults(defineProps<FormProps<S, T>>(), {
  validateOn() {
    return ['input', 'blur', 'change'] as FormInputEvents[]
  },
  validateOnInputDelay: 300,
  attach: true,
  transform: () => true as T,
  loadingAuto: true
})

const emits = defineEmits<FormEmits<S, T>>()
defineSlots<FormSlots>()
const formId = props.id ?? useId() as string

const {
  errors,
  loading,
  validate: formValidate,
  handleSubmit,
  setErrors,
  getErrors,
  setFieldError,
  clearErrors,
  watch,
  setFieldValue,
  disabled: formDisabled,
  dirtyFields,
  touchedFields,
  blurredFields,
  errorBag,
  bind,
  registerNestedForm,
  unregisterNestedForm,
  reset,
  resetField,
  handleBlur,
  handleFocus,
  handleChange,
  handleInput
} = useForm({
  id: formId,
  schema: props.schema,
  validate: props.validate,
  validateOn: props.validateOn,
  validateOnInputDelay: props.validateOnInputDelay,
  transform: props.transform,
  loadingAuto: props.loadingAuto,
  values: props.state,
  defaultValues: props.state,
  disabled: computed(() => props.disabled)
})

const appConfig = useAppConfig() as FormConfig['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.form || {}) }))

const bus = useEventBus<FormEvent<I>>(`form-${formId}`)
const parentBus = props.attach && inject(
  formBusInjectionKey,
  undefined
)

provide(formBusInjectionKey, bus)

onMounted(async () => {
  bus.on(async (event) => {
    if (event.type === 'attach') {
      registerNestedForm(event.formId, { validate: event.validate })
    } else if (event.type === 'detach') {
      unregisterNestedForm(event.formId)
    } else if (props.validateOn?.includes(event.type) && !loading.value) {
      if (event.type !== 'input') {
        await formValidate({ name: event.name, silent: true, nested: false })
      } else if (event.eager || blurredFields.has(event.name)) {
        await formValidate({ name: event.name, silent: true, nested: false })
      }
    }

    if (event.type === 'blur') {
      blurredFields.add(event.name)
    }

    if (event.type === 'change' || event.type === 'input' || event.type === 'blur' || event.type === 'focus') {
      touchedFields.add(event.name)
    }

    if (event.type === 'change' || event.type === 'input') {
      dirtyFields.add(event.name)
    }
  })
})

onUnmounted(() => {
  bus.reset()
})

onMounted(async () => {
  if (parentBus) {
    await nextTick()
    parentBus.emit({ type: 'attach', validate: formValidate, formId })
  }
})

onUnmounted(() => {
  if (parentBus) {
    parentBus.emit({ type: 'detach', formId })
  }
})

const onSuccess = async (data: FormData<S, T>, payload?: Event) => {
  const event = payload as FormSubmitEvent<FormData<S, T>>
  event.data = data
  await props.onSubmit?.(event)
}

const onError = (error: FormValidationException, payload?: Event) => {
  const event = payload as FormSubmitEvent<FormData<S, T>>

  const errorEvent: FormErrorEvent = {
    ...event,
    errors: error.errors,
    children: error.children
  }
  emits('error', errorEvent)
}

const onSubmitWrapper = handleSubmit(onSuccess, onError)

defineExpose<Form<S>>({
  validate: formValidate,
  errors,
  setErrors,
  getErrors,
  clearErrors,
  async submit() {
    await onSubmitWrapper(new Event('submit'))
  },
  disabled: formDisabled,
  loading,
  dirty: computed(() => !!dirtyFields.size),
  dirtyFields: readonly(dirtyFields),
  blurredFields: readonly(blurredFields),
  touchedFields: readonly(touchedFields),
  setFieldError,
  errorBag,
  bind,
  watch,
  setFieldValue,
  resetField,
  handleInput,
  handleChange,
  handleBlur,
  handleFocus,
  reset
})
</script>

<template>
  <component
    :is="parentBus ? 'div' : 'form'"
    :id="formId"
    :class="ui({ class: props.class })"
    @submit.prevent="onSubmitWrapper"
  >
    <slot :errors="errors" :loading="loading" />
  </component>
</template>
