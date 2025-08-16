import { ref, reactive, shallowReactive, computed, readonly, isRef, watch as vueWatch, type Ref, type WatchOptions, provide, useId, type WatchCallback } from 'vue'
import { type FormSchema, type FormError, type FormInputEvents, type FormErrorWithId, type InferInput, type InferOutput, type FormData, FormValidationException } from '../types/form'
import { validateSchema } from '../utils/form'
import { useDebounceFn } from '@vueuse/core'
import { cloneObject, get, set } from '../utils'
import { formInputsInjectionKey, formLoadingInjectionKey, formOptionsInjectionKey } from './useFormField'
import type { ErrorBagTree, Paths, PathValue } from '../types'

export interface UseFormOptions<S extends FormSchema, T extends boolean = true> {
  id?: string | number
  schema?: S
  defaultValues?: Partial<InferInput<S>>
  values?: Partial<InferInput<S>>
  validate?: (state: Partial<InferInput<S>>) => Promise<FormError[]> | FormError[]
  validateOn?: FormInputEvents[]
  validateOnInputDelay?: number
  transform?: T
  disabled?: Ref<boolean> | boolean
  loadingAuto?: boolean
  shallow?: boolean
}

export function useForm<S extends FormSchema, T extends boolean = true>(options: UseFormOptions<S, T>) {
  const initialState: Partial<InferInput<S>> = cloneObject(options.defaultValues) ?? {} as InferInput<S>

  const state = (options.shallow ? shallowReactive : reactive)(options.values ?? initialState) as InferInput<S>

  const formId = options.id ?? useId() as string

  const errors = ref<FormErrorWithId[]>([])
  provide('form-errors', errors)

  const errorBag = computed(() => {
    return errors.value.reduce((bag, error) => {
      if (error.name) {
        set(bag, error.name, {
          id: error.id,
          message: error.message
        })
      }
      return bag
    }, {} as ErrorBagTree<InferInput<S>>)
  })

  const inputs = ref<{ [P in keyof InferInput<S>]?: { id?: string, pattern?: RegExp } }>({})
  provide(formInputsInjectionKey, inputs as any)

  const dirtyFields: Set<keyof InferInput<S>> = reactive(new Set())
  const touchedFields: Set<keyof InferInput<S>> = reactive(new Set())
  const blurredFields: Set<keyof InferInput<S>> = reactive(new Set())

  const loading = ref(false)
  provide(formLoadingInjectionKey, readonly(loading))

  const customDisabled = isRef(options.disabled) ? options.disabled : ref(options.disabled ?? false)
  const disabled = computed(() => customDisabled.value || loading.value)

  provide(formOptionsInjectionKey, computed(() => ({
    disabled: disabled.value,
    validateOnInputDelay: options.validateOnInputDelay
  })))

  const transformedState = ref<InferOutput<S> | null>(null)

  const validateOn = options.validateOn ?? ['input', 'blur', 'change']
  const transform = options.transform ?? true as T
  const loadingAuto = options.loadingAuto ?? true

  function resolveErrorIds(errs: FormError[]): FormErrorWithId[] {
    return errs.map(err => ({
      ...err,
      id: err?.name && inputs.value[err.name as string] ? inputs.value[err.name as string]?.id : undefined
    }))
  }

  async function fetchAllErrors(): Promise<FormErrorWithId[]> {
    let errs = options.validate ? (await options.validate(state)) ?? [] : []

    if (options.schema) {
      const { errors, result } = await validateSchema(state, options.schema as FormSchema<typeof state>)
      if (errors) {
        errs = errs.concat(errors)
      } else {
        transformedState.value = result
      }
    }
    return resolveErrorIds(errs)
  }

  const nestedForms = ref<Map<string | number, { validate: any }>>(new Map())

  function registerNestedForm(formId: string | number, form: { validate: any }) {
    nestedForms.value.set(formId, form)
  }

  function unregisterNestedForm(formId: string | number) {
    nestedForms.value.delete(formId)
  }

  type ValidateOpts<Silent extends boolean, Transform extends boolean> = { name?: keyof InferInput<S> | (keyof InferInput<S>)[], silent?: Silent, nested?: boolean, transform?: Transform }
  async function validate<T extends boolean>(opts: ValidateOpts<false, T>): Promise<FormData<S, T>>
  async function validate<T extends boolean>(opts: ValidateOpts<true, T>): Promise<FormData<S, T> | false>
  async function validate<T extends boolean>(opts: ValidateOpts<boolean, boolean> = { silent: false, nested: true, transform: false }): Promise<FormData<S, T> | false> {
    const names = opts.name && !Array.isArray(opts.name) ? [opts.name] : opts.name as (keyof InferOutput<S>)[]

    const nestedValidatePromises = !names && opts.nested
      ? Array.from(nestedForms.value.values()).map(
          ({ validate }) => validate(opts as any).then(() => undefined).catch((error: Error) => {
            if (!(error instanceof FormValidationException)) {
              throw error
            }
            return error
          })
        )
      : []

    if (names) {
      // Create a Set for O(1) lookups. More performant than names.some().
      const namesSet = new Set(names)
      const patterns = names
        .map(name => inputs.value?.[name]?.pattern)
        .filter(Boolean) as RegExp[]

      const isErrorForPath = (error: FormErrorWithId): boolean => {
        if (!error.name) return false
        if (namesSet.has(error.name as keyof InferInput<S>)) return true
        return patterns.some(pattern => pattern.test(error.name!))
      }

      const allNewErrors = await fetchAllErrors()

      const otherErrors = errors.value.filter(error => !isErrorForPath(error))
      const pathErrors = allNewErrors.filter(isErrorForPath)

      errors.value = otherErrors.concat(pathErrors)
    } else {
      errors.value = await fetchAllErrors()
    }

    const childErrors = (await Promise.all(nestedValidatePromises)).filter(val => val !== undefined)

    if (errors.value.length + childErrors.length > 0) {
      if (opts.silent) return false
      throw new FormValidationException(formId, errors.value, childErrors)
    }

    if (opts.transform) {
      Object.assign(state, transformedState.value)
    }

    return state as FormData<S, T>
  }

  const debouncedValidate = useDebounceFn(validate, options.validateOnInputDelay || 300)

  function handleSubmit(onSuccess: (data: FormData<S, T>, event?: Event) => any, onError?: (error: FormValidationException, event?: Event) => any) {
    return async (event?: Event) => {
      event?.preventDefault()
      if (disabled.value) return

      loading.value = loadingAuto && true

      try {
        const data = await validate({ transform, nested: true })

        const result = await onSuccess(data, event)
        dirtyFields.clear()
        return result
      } catch (error) {
        if (error instanceof FormValidationException) {
          await onError?.(error)
        } else {
          throw error
        }
      } finally {
        loading.value = false
      }
    }
  }

  function handleReset() {
    const newInitialState = cloneObject(initialState)
    Object.assign(state, newInitialState)
    errors.value = []
    dirtyFields.clear()
    touchedFields.clear()
    blurredFields.clear()
  }

  function _updateFieldState<K extends Paths<InferInput<S>>>(name: K, value: InferInput<S>[K], type: FormInputEvents) {
    touchedFields.add(name)

    if (type === 'blur') {
      blurredFields.add(name)
    } else {
      setFieldValue(name, value)
      dirtyFields.add(name)
    }

    if (validateOn.includes(type)) {
      if (type === 'input') {
        debouncedValidate({ name })
      } else {
        validate({ name })
      }
    }
  }

  const _handleInputLogic = <K extends Paths<InferInput<S>>>(name: K, value: InferInput<S>[K]) => _updateFieldState(name,
    value, 'input')
  const _handleChangeLogic = <K extends Paths<InferInput<S>>>(name: K, value: InferInput<S>[K]) => _updateFieldState(name,
    value, 'change')
  const _handleBlurLogic = (name: Paths<InferInput<S>>) => _updateFieldState(name, undefined,
    'blur')

  function getEventValue(event: Event | CustomEvent, currentValue: any) {
    const isCustomEvent = event instanceof CustomEvent
    const payload = isCustomEvent ? event.detail : event.target

    if (payload && typeof payload === 'object' && 'type' in payload) {
      const target = payload as HTMLInputElement
      if (target.type === 'checkbox' && 'checked' in target) {
        return target.checked
      }
      if (typeof currentValue === 'number' && 'valueAsNumber' in target) {
        return !Number.isNaN(target.valueAsNumber) ? target.valueAsNumber : target.value
      }
      return target.value
    }

    if (payload && typeof payload === 'object' && 'value' in payload) {
      return (payload as { value: any }).value
    }

    return payload
  }

  function bind<K extends Paths<InferInput<S>>>(name: K) {
    const getValue = get(state, name)
    const fieldProps = {
      'name': name as string,
      'modelValue': getValue,
      'onUpdate:modelValue': (val: InferInput<S>[K]) => {
        _handleInputLogic(name, val)
      },
      // For native component
      'value': getValue,
      'onInput': (event: Event | CustomEvent) => {
        const value = getEventValue(event, getValue)
        if (event.target && (event.target as HTMLInputElement).type === 'checkbox') {
          return
        }
        _handleInputLogic(name, value as InferInput<S>[K])
      },
      'onBlur': () => _handleBlurLogic(name),
      'onChange': (event: Event | CustomEvent) => {
        const value = getEventValue(event, getValue)
        _handleChangeLogic(name, value as InferInput<S>[K])
      }
    }

    return fieldProps
  }

  function handleBlur(event: FocusEvent) {
    const name = (event.target as HTMLInputElement).name as Paths<InferInput<S>>
    if (!name) return
    _handleBlurLogic(name)
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    const name = target.name as Paths<InferInput<S>>
    if (!name) return
    const value = target.type === 'checkbox' ? target.checked : target.value
    _handleInputLogic(name, value as any)
  }

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement
    const name = target.name as Paths<InferInput<S>>
    if (!name) return
    const value = target.type === 'checkbox' ? target.checked : target.value
    _handleChangeLogic(name, value as any)
  }

  function setFieldError<K extends Paths<InferInput<S>>>(name: K, error: Omit<FormErrorWithId, 'name'>) {
    if (name) {
      errors.value.push({
        ...error,
        name: name as string
      })
    }
  }

  function setErrors(errs: FormError[], name?: Paths<InferInput<S>> | RegExp) {
    if (name) {
      errors.value = errors.value
        .filter(err => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name)
        .concat(resolveErrorIds(errs))
    } else {
      errors.value = resolveErrorIds(errs)
    }
  }

  function getErrors(name?: Paths<InferInput<S>> | RegExp) {
    if (name) {
      return errors.value.filter(err => name instanceof RegExp ? err.name && name.test(err.name) : err.name === name)
    }
    return errors.value
  }

  function clear(name?: Paths<InferInput<S>> | RegExp) {
    if (name) {
      errors.value = errors.value.filter(err => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name)
    } else {
      errors.value = []
    }
  }

  function setFieldValue<K extends Paths<InferInput<S>>>(name: K, value: PathValue<InferInput<S>, K>) {
    if (!name) return

    set(state, name, value === '' ? get(initialState, name) as PathValue<InferInput<S>, K> : value)
  }

  function watch<K extends Paths<InferInput<S>>>(
    key: K,
    cb: WatchCallback<PathValue<InferInput<S>, K>, PathValue<InferInput<S>, K>>,
    options?: WatchOptions
  ): void
  function watch(
    cb: WatchCallback<Partial<InferInput<S>>, Partial<InferInput<S>>>,
    options?: WatchOptions
  ): void
  function watch<K extends keyof InferInput<S>>(
    arg1: K | WatchCallback<Partial<InferInput<S>>, Partial<InferInput<S>> | undefined>,
    arg2?: WatchCallback<PathValue<InferInput<S>, K>, PathValue<InferInput<S>, K>> | WatchOptions,
    arg3?: WatchOptions
  ) {
    if (typeof arg1 === 'string') {
      vueWatch(() => get(state, arg1), arg2 as WatchCallback<PathValue<InferInput<S>, K>, PathValue<InferInput<S>, K> | undefined>, arg3)
    } else if (typeof arg1 === 'function') {
      vueWatch(state, arg1, arg2 as WatchOptions)
    }
  }

  return {
    state,
    errors,
    loading,
    disabled,
    dirty: computed(() => !!dirtyFields.size),
    dirtyFields,
    touchedFields,
    blurredFields,
    validate,
    handleSubmit,
    handleReset,
    bind,
    handleBlur,
    handleInput,
    handleChange,
    setErrors,
    setFieldError,
    getErrors,
    clear,
    setFieldValue,
    watch,
    errorBag,

    // Internal
    registerNestedForm,
    unregisterNestedForm

  }
}
