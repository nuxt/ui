<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/form'
import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, FormEvent, Form, FormErrorWithId, InferInput, InferOutput, FormData } from '../types/form'
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
  nested?: N

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

// The comparison with '' is needed because vue is not casting boolean correctly without
// explicitly setting the prop to true (`:nested="true" works, but `nested` returns '')
const isNested = props.nested?.toString() === '' || props.nested === true
const parentBus = isNested && inject(
  formBusInjectionKey,
  undefined
)

const parentState = isNested ? inject(formStateInjectionKey, undefined) : undefined
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

  async function validateNestedForms({ validate, name }: { validate: typeof _validate, name?: string }) {
    try {
      return { name, output: await validate({ ...opts, silent: false }) }
    } catch (error: unknown) {
      if (!(error instanceof FormValidationException)) {
        throw error
      }
      return { name, error }
    }
  }

  const nestedValidatePromises = !names && opts.nested
    ? Array.from(nestedForms.value.values()).map(validateNestedForms)
    : []

  const nestedResults = await Promise.all(nestedValidatePromises)
  const nestedErrors = nestedResults.flatMap((result) => {
    if (!result.error) return []
    return result.error.errors.map(e => ({ ...e, name: result.name ? [result.name, e.name].join('.') : e.name }))
  })

  const nestedOutputs = nestedResults.filter(c => c.output !== undefined)
  const allErrors = [await getErrors(), nestedErrors].flat()

  if (names) {
    const namesSet = new Set(names)
    const patterns = names
      .map(name => inputs.value?.[name]?.pattern)
      .filter(Boolean) as RegExp[]

    const isErrorForPath = (error: FormErrorWithId): boolean => {
      if (!error.name) return false
      if (namesSet.has(error.name)) return true
      return patterns.some(pattern => pattern.test(error.name!))
    }

    const otherErrors = errors.value.filter(error => !isErrorForPath(error))
    const pathErrors = allErrors.filter(isErrorForPath)

    errors.value = otherErrors.concat(pathErrors)
  } else {
    errors.value = allErrors
  }

  if (errors.value?.length) {
    if (opts.silent) return false
    throw new FormValidationException(formId, errors.value)
  }

  if (opts.transform) {
    nestedOutputs.forEach((o) => {
      if (o.name) setAtPath(transformedState.value, o.name, o.output)
      else Object.assign(transformedState.value, o.output)
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

const api = {
  validate: _validate,
  errors,

  setErrors(errs: FormError[], name?: keyof I | string | RegExp) {
    let formErrors: FormErrorWithId[] = resolveErrorIds(errs).filter(e => e.id)

    if (name) {
      formErrors = errors.value
        .filter(err =>
          name instanceof RegExp
            ? !(err.name && name.test(err.name))
            : err.name !== name
        ).concat(formErrors)
    }

    for (const form of nestedForms.value.values()) {
      const errors = errs.flatMap((e) => {
        if (!form.name) return [e]
        if (e?.name?.startsWith(form.name + `.`)) {
          return [{
            ...e,
            name: e?.name.split(form.name + `.`)[1]
          }]
        }
        return []
      })

      const nameMatch = name instanceof RegExp ? form.name && name.test(form.name.toString()) : form.name !== name
      if (nameMatch || !form.name) {
        form.api.setErrors(errors, name)
        formErrors = formErrors.concat(form.api.getErrors().map(e => ({ ...e, name: form.name ? [form.name, e.name].join('.') : e.name })))
      }
    }

    errors.value = formErrors
  },

  async submit() {
    await onSubmitWrapper(new Event('submit'))
  },

  getErrors(name?: keyof I | string | RegExp) {
    if (name) {
      return errors.value.filter(err => name instanceof RegExp ? err.name && name.test(err.name) : err.name === name)
    }
    return errors.value
  },

  clear(name?: keyof I | string | RegExp) {
    let formErrors: FormError[] = []

    if (name) {
      formErrors = errors.value.filter(
        (err) => {
          return (err.name && !!inputs.value[err.name])
            && (name instanceof RegExp
              ? !(err.name && name.test(err.name))
              : err.name !== name)
        })
    }

    for (const form of nestedForms.value.values()) {
      if (!form.name) form.api.clear(name)
      else if (form.name === name || (name instanceof RegExp && name.test(form.name))) form.api.clear()
      else if (typeof name === 'string' && name?.startsWith(form.name + `.`)) {
        const nestedName = name?.split(`${form.name}.`)[1]
        form.api.clear(nestedName)
      }

      formErrors = formErrors.concat(
        form.api.getErrors().map(e => ({
          ...e,
          name: form.name ? [form.name, e.name].join('.') : e.name
        }))
      )
    }

    errors.value = formErrors
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
