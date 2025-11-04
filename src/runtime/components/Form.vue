<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form'
import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, FormEvent, Form, FormErrorWithId, InferInput, InferOutput, FormData } from '../types/form'
import type { FormHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

type FormConfig = ComponentConfig<typeof theme, AppConfig, 'form'>

export type FormProps<S extends FormSchema, T extends boolean = true, N extends boolean = false> = {
  id?: string | number
  /** Schema to validate the form state. Supports Standard Schema objects, Yup, Joi, and Superstructs. */
  schema?: S
  /** An object representing the current state of the form. */
  state?: N extends false ? Partial<InferInput<S>> : never
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
   * Path of the form's state within it's parent form.
   * Used for nesting forms. Only available if `nested` is true.
   */
  name?: N extends true ? string : never

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
   * If true, this form will attach to its parent Form and validate at the same time.
   * @defaultValue `false`
   */
  nested?: N & boolean

  /**
   * When `true`, all form elements will be disabled on `@submit` event.
   * This will cause any focused input elements to lose their focus state.
   * @defaultValue `true`
   */
  loadingAuto?: boolean
  class?: any
  onSubmit?: ((event: FormSubmitEvent<FormData<S, T>>) => void | Promise<void>) | (() => void | Promise<void>)
} & /** @vue-ignore */ Omit<FormHTMLAttributes, 'name'>

export interface FormEmits<S extends FormSchema, T extends boolean = true> {
  submit: [event: FormSubmitEvent<FormData<S, T>>]
  error: [event: FormErrorEvent]
}

export interface FormSlots {
  default(props: { errors: FormError[], loading: boolean }): any
}
</script>

<script lang="ts" setup generic="S extends FormSchema, T extends boolean = true, N extends boolean = false">
import { provide, inject, nextTick, ref, onUnmounted, onMounted, computed, useId, readonly, reactive } from 'vue'
import { useEventBus } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { formOptionsInjectionKey, formInputsInjectionKey, formBusInjectionKey, formLoadingInjectionKey, formErrorsInjectionKey, formStateInjectionKey } from '../composables/useFormField'
import { tv } from '../utils/tv'
import { validateSchema, getAtPath, setAtPath } from '../utils/form'
import { FormValidationException } from '../types/form'

type I = InferInput<S>
type O = InferOutput<S>

const props = withDefaults(defineProps<FormProps<S, T, N>>(), {
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

const formId = props.id ?? useId() as string

const bus = useEventBus<FormEvent<I>>(`form-${formId}`)

const parentBus = props.nested === true && inject(
  formBusInjectionKey,
  undefined
)

const parentState = props.nested === true ? inject(formStateInjectionKey, undefined) : undefined
const state = computed(() => {
  if (parentState?.value) {
    return props.name ? getAtPath(parentState.value, props.name) : parentState.value
  }
  return props.state
})

provide(formBusInjectionKey, bus)
provide(formStateInjectionKey, state)

const nestedForms = ref<Map<string | number, { validate: typeof _validate, name?: string, api: Form<any> }>>(new Map())

onMounted(async () => {
  if (parentBus) {
    await nextTick()
    parentBus.emit({ type: 'attach', validate: _validate, formId, name: props.name, api })
  }
})

onUnmounted(() => {
  bus.reset()
  if (parentBus) {
    parentBus.emit({ type: 'detach', formId })
  }
})

onMounted(async () => {
  bus.on(async (event) => {
    if (event.type === 'attach') {
      nestedForms.value.set(event.formId, { validate: event.validate, name: event.name, api: event.api as any })
    } else if (event.type === 'detach') {
      nestedForms.value.delete(event.formId)
    } else if (props.validateOn?.includes(event.type) && !loading.value) {
      if (event.type !== 'input') {
        await _validate({ name: event.name, silent: true, nested: false })
      } else if (event.eager || blurredFields.has(event.name)) {
        await _validate({ name: event.name, silent: true, nested: false })
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

const errors = ref<FormErrorWithId[]>([])

provide(formErrorsInjectionKey, errors)

const inputs = ref<{ [P in keyof I]?: { id?: string, pattern?: RegExp } }>({})
provide(formInputsInjectionKey, inputs as any)

const dirtyFields: Set<keyof I> = reactive(new Set<keyof I>())
const touchedFields: Set<keyof I> = reactive(new Set<keyof I>())
const blurredFields: Set<keyof I> = reactive(new Set<keyof I>())

function resolveErrorIds(errs: FormError[]): FormErrorWithId[] {
  return errs.map(err => ({
    ...err,
    id: err?.name ? inputs.value[err.name]?.id : undefined
  }))
}

const transformedState = ref<O | null>(null)

async function getErrors(): Promise<FormErrorWithId[]> {
  let errs = props.validate ? (await props.validate(state.value)) ?? [] : []

  if (props.schema) {
    const { errors, result } = await validateSchema(state.value, props.schema)
    if (errors) {
      errs = errs.concat(errors)
    } else {
      transformedState.value = result
    }
  }

  return resolveErrorIds(errs)
}

type ValidateOpts<Silent extends boolean, Transform extends boolean> = { name?: keyof I | (keyof I)[], silent?: Silent, nested?: boolean, transform?: Transform }
async function _validate<T extends boolean>(opts: ValidateOpts<false, T>): Promise<FormData<S, T>>
async function _validate<T extends boolean>(opts: ValidateOpts<true, T>): Promise<FormData<S, T> | false>
async function _validate<T extends boolean>(opts: ValidateOpts<boolean, boolean> = { silent: false, nested: false, transform: false }): Promise<FormData<S, T> | false> {
  const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name as (keyof O)[]

  // Validate nested forms if needed
  let nestedResults: any[] = []
  let nestedErrors: FormError[] = []

  if (!names && opts.nested) {
    const validations = Array.from(nestedForms.value.values()).map(form =>
      validateNestedForm(form, opts)
    )
    const results = await Promise.all(validations)

    nestedErrors = results
      .filter(r => r.error)
      .flatMap(r => r.error!.errors.map(e => addFormPath(e, r.name)))

    nestedResults = results.filter(r => r.output !== undefined)
  }

  // Get all errors
  const currentErrors = await getErrors()
  const allErrors = [...currentErrors, ...nestedErrors]

  // Filter by field names if specified
  if (names) {
    errors.value = filterErrorsByNames(allErrors, names)
  } else {
    errors.value = allErrors
  }

  // Handle validation failure
  if (errors.value?.length) {
    if (opts.silent) return false
    throw new FormValidationException(formId, errors.value)
  }

  // Apply transformations
  if (opts.transform) {
    nestedResults.forEach((result) => {
      if (result.name) {
        setAtPath(transformedState.value, result.name, result.output)
      } else {
        Object.assign(transformedState.value, result.output)
      }
    })
    return transformedState.value ?? state.value
  }

  return state.value as FormData<S, T>
}

const loading = ref(false)
provide(formLoadingInjectionKey, readonly(loading))

async function onSubmitWrapper(payload: Event) {
  loading.value = props.loadingAuto && true

  const event = payload as FormSubmitEvent<FormData<S, T>>

  try {
    event.data = await _validate({ nested: true, transform: props.transform })
    await props.onSubmit?.(event)
    dirtyFields.clear()
  } catch (error) {
    if (!(error instanceof FormValidationException)) {
      throw error
    }

    const errorEvent: FormErrorEvent = {
      ...event,
      errors: error.errors
    }
    emits('error', errorEvent)
  } finally {
    loading.value = false
  }
}

const disabled = computed(() => props.disabled || loading.value)

provide(formOptionsInjectionKey, computed(() => ({
  disabled: disabled.value,
  validateOnInputDelay: props.validateOnInputDelay
})))

// Simple helper functions for nested forms
async function validateNestedForm(form: { validate: typeof _validate, name?: string }, opts: ValidateOpts<boolean, boolean>) {
  try {
    const result = await form.validate({ ...opts, silent: false })
    return { name: form.name, output: result }
  } catch (error: unknown) {
    if (!(error instanceof FormValidationException)) throw error
    return { name: form.name, error }
  }
}

function addFormPath(error: FormError, formPath?: string): FormError {
  if (!formPath || !error.name) return error
  return { ...error, name: formPath + '.' + error.name }
}

function stripFormPath(error: FormError, formPath: string): FormError {
  const prefix = formPath + '.'
  const name = error?.name?.startsWith(prefix)
    ? error.name.substring(prefix.length)
    : error.name
  return { ...error, name }
}

function filterFormErrors(errors: FormError[], formPath?: string): FormError[] {
  if (!formPath) return errors

  return errors
    .filter(e => e?.name?.startsWith(formPath + '.'))
    .map(e => stripFormPath(e, formPath))
}

function getFormErrors(form: { name?: string, api: Form<any> }): FormErrorWithId[] {
  return form.api.getErrors().map(e =>
    form.name ? { ...e, name: form.name + '.' + e.name } : e
  )
}

function matchesTarget(target: keyof I | string | RegExp | undefined, path?: string): boolean {
  if (!target || !path) return true
  if (target instanceof RegExp) return target.test(path)
  return path === target || (typeof target === 'string' && target.startsWith(path + '.'))
}

function getNestedTarget(target: keyof I | string | RegExp | undefined, formPath: string): keyof I | string | RegExp | undefined {
  if (!target || target instanceof RegExp) return target
  if (formPath === target) return undefined
  if (typeof target === 'string' && target.startsWith(formPath + '.')) {
    return target.substring(formPath.length + 1)
  }
  return target
}

function filterErrorsByNames(allErrors: FormErrorWithId[], names: (keyof O)[]): FormErrorWithId[] {
  const nameSet = new Set(names)
  const patterns = names
    .map(name => inputs.value?.[name]?.pattern)
    .filter(Boolean) as RegExp[]

  const matchesNames = (error: FormErrorWithId): boolean => {
    if (!error.name) return false
    if (nameSet.has(error.name)) return true
    return patterns.some(pattern => pattern.test(error.name!))
  }

  const keepErrors = errors.value.filter(error => !matchesNames(error))
  const newErrors = allErrors.filter(matchesNames)

  return [...keepErrors, ...newErrors]
}

function filterErrorsByTarget(currentErrors: FormErrorWithId[], target: keyof I | string | RegExp): FormErrorWithId[] {
  return currentErrors.filter(err =>
    target instanceof RegExp
      ? !(err.name && target.test(err.name))
      : !err.name || err.name !== target
  )
}

function isLocalError(error: FormError): boolean {
  return !error.name || !!inputs.value[error.name]
}

const api = {
  validate: _validate,
  errors,

  setErrors(errs: FormError[], name?: keyof I | string | RegExp) {
    // Handle local errors
    const localErrors = resolveErrorIds(errs.filter(isLocalError))

    // Handle nested form errors
    const nestedErrors: FormErrorWithId[] = []
    for (const form of nestedForms.value.values()) {
      if (matchesTarget(name, form.name)) {
        const formErrors = filterFormErrors(errs, form.name)
        form.api.setErrors(formErrors, getNestedTarget(name, form.name || ''))
        nestedErrors.push(...getFormErrors(form as any))
      }
    }

    if (name) {
      const keepErrors = filterErrorsByTarget(errors.value, name)
      errors.value = [...keepErrors, ...localErrors, ...nestedErrors]
    } else {
      errors.value = [...localErrors, ...nestedErrors]
    }
  },

  async submit() {
    await onSubmitWrapper(new Event('submit'))
  },

  getErrors(name?: keyof I | string | RegExp) {
    if (!name) return errors.value

    return errors.value.filter(err =>
      name instanceof RegExp
        ? err.name && name.test(err.name)
        : err.name === name
    )
  },

  clear(name?: keyof I | string | RegExp) {
    // Keep local errors not matching the target
    const localErrors = name
      ? errors.value.filter(err =>
          isLocalError(err)
          && (name instanceof RegExp
            ? !(err.name && name.test(err.name))
            : err.name !== name)
        )
      : []

    // Clear from nested forms and collect remaining errors
    const nestedErrors: FormError[] = []
    for (const form of nestedForms.value.values()) {
      if (matchesTarget(name, form.name)) form.api.clear()
      nestedErrors.push(...getFormErrors(form as any))
    }

    errors.value = [...localErrors, ...nestedErrors]
  },

  disabled,
  loading,
  dirty: computed(() => !!dirtyFields.size),
  dirtyFields: readonly(dirtyFields),
  blurredFields: readonly(blurredFields),
  touchedFields: readonly(touchedFields)
} satisfies Form<S>

defineExpose(api)
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
