<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form'
import { useForm, type GenericFormSchema } from '@formwerk/core'
import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, InferInput, InferOutput, FormData } from '../types/form'
import type { ComponentConfig } from '../types/tv'

type FormConfig = ComponentConfig<typeof theme, AppConfig, 'form'>

export type FormProps<TSchema extends GenericFormSchema, S extends FormSchema, T extends boolean = true> = {
  id?: string | number
  /** Schema to validate the form state. Supports Standard Schema objects, Yup, Joi, and Superstructs. */
  schema?: TSchema
  /** An object representing the current state of the form. */
  state?: InferInput<S>
  /**
   * Custom validation function to validate the form state.
   * @param state - The current state of the form.
   * @returns A promise that resolves to an array of FormError objects, or an array of FormError objects directly.
   */
  validate?: (state: InferInput<S>) => Promise<FormError[]> | FormError[]

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
   * If true, applies schema transformations on submit.
   * @defaultValue `true`
   */
  transform?: T

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
  submit: [event: FormSubmitEvent<FormData<S, T>>]
  error: [event: FormErrorEvent]
}

export interface FormSlots {
  default(props: { errors: FormError[], loading: boolean }): any
}
</script>

<script lang="ts" setup generic="TSchema extends GenericFormSchema, S extends FormSchema, T extends boolean = true">
import { ref, computed, useId } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from 'tailwind-variants'

type I = InferInput<S>
type O = InferOutput<S>

const props = withDefaults(defineProps<FormProps<TSchema, S, T>>(), {
  validateOn() {
    return ['input', 'blur', 'change'] as FormInputEvents[]
  },
  validateOnInputDelay: 300,
  transform: () => true as T,
  loadingAuto: true
})

const emits = defineEmits<FormEmits<S, T>>()
defineSlots<FormSlots>()

const appConfig = useAppConfig() as FormConfig['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.form || {}) }))
const formId = props?.id?.toString() ?? useId()

const errors = ref<FormError[]>([])
const loading = ref(false)

const { validate, values, getIssues } = useForm<TSchema>({ initialValues: props.state, schema: props.schema })

async function onSubmitWrapper(event: Event) {
  const validateErrors = await props?.validate?.(values)
  await validate()
  const issues = getIssues()

  errors.value = issues.flatMap<FormError>((i) => {
    return i.messages.map(message => ({ name: i.path, message }))
  }).concat(validateErrors ?? [])

  if (!errors?.value?.length) {
    (event as any).data = values
    await props?.onSubmit?.(event as FormSubmitEvent<O>)
  } else {
    (event as any).errors = errors.value
    emits('error', event as FormErrorEvent)
  }
}
</script>

<template>
  <form
    :id="formId"
    :class="ui({ class: props.class })"
    @submit.prevent="onSubmitWrapper"
  >
    <slot :errors="errors" :loading="loading" />
  </form>
</template>
