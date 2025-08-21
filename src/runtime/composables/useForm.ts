import { ref, reactive, shallowReactive, computed, readonly, isRef, watch as vueWatch, type Ref, type WatchOptions, provide, useId, type WatchCallback } from 'vue'
import { type FormSchema, type FormError, type FormInputEvents, type FormErrorWithId, type InferInput, type InferOutput, type FormData, FormValidationException } from '../types/form'
import { createState, validateSchema } from '../utils/form'
import { useDebounceFn } from '@vueuse/core'
import { cloneObject, get, getObjectPaths, set } from '../utils'
import { formInputsInjectionKey, formLoadingInjectionKey, formOptionsInjectionKey } from './useFormField'
import type { DeepPartial, ErrorBagTree, Path, PathValue } from '../types'

export interface UseFormOptions<S extends FormSchema, T extends boolean = true, State extends InferInput<S> = InferInput<S>> {
  id?: string | number
  schema?: S
  defaultValues?: Partial<State>
  values?: Partial<State>
  validate?: (state: State) => Promise<FormError[]> | FormError[]
  validateOn?: FormInputEvents[]
  validateOnInputDelay?: number
  transform?: T
  disabled?: Ref<boolean> | boolean
  loadingAuto?: boolean
  shallow?: boolean
}

export function useForm<S extends FormSchema, T extends boolean = true, State extends InferInput<S> = InferInput<S>>(options: UseFormOptions<S, T, State>) {
  const initialState: Partial<State> = options.defaultValues ? (cloneObject(options.defaultValues) ?? {} as State) : createState(options.schema) as Partial<State>

  const state = (options.shallow ? shallowReactive : reactive)(options.values ?? { ...initialState }) as State

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
    }, {} as ErrorBagTree<State>)
  })

  const inputs = ref<{ [P in keyof State]?: { id?: string, pattern?: RegExp } }>({})
  provide(formInputsInjectionKey, inputs as any)

  const dirtyFields = reactive(new Set()) as Set<Path<State>>
  const touchedFields = reactive(new Set()) as Set<Path<State>>
  const blurredFields = reactive(new Set()) as Set<Path<State>>

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

  type ValidateOpts<Silent extends boolean, Transform extends boolean> = { name?: Path<State> | (keyof Path<State>)[], silent?: Silent, nested?: boolean, transform?: Transform }
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
        if (namesSet.has(error.name as keyof State)) return true
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

  function resetField<K extends Path<State>>(name: K, options: {
    defaultValue?: PathValue<State, K>
    keepDirty?: boolean
    keepTouched?: boolean
    keepError?: boolean
  } = {}) {
    if (!name) return
    setFieldValue(name, options.defaultValue!)

    if (!options.keepDirty) {
      dirtyFields.delete(name)
    }

    if (!options.keepTouched) {
      touchedFields.delete(name)
      blurredFields.delete(name)
    }

    if (!options.keepError) {
      clearErrors(name)
    }
  }

  function clear() {
    const newInitialState = cloneObject(initialState)
    Object.assign(state, newInitialState)
    errors.value = []
    dirtyFields.clear()
    touchedFields.clear()
    blurredFields.clear()
  }

  function reset(): void
  function reset<U extends DeepPartial<State>>(values: U, options?: {
    keepErrors?: boolean
    keepDirty?: boolean
    keepDefaultValues?: boolean
  }): void
  function reset<U extends DeepPartial<State>>(values: (value: U) => U, options?: {
    keepErrors?: boolean
    keepDirty?: boolean
  }): void
  function reset<U extends DeepPartial<State>>(
    values?: U | ((currentValues: U) => U),
    options: {
      keepErrors?: boolean
      keepDirty?: boolean
      keepDefaultValues?: boolean
    } = {}
  ) {
    if (!values) {
      clear()
      return
    }

    const newValues = typeof values === 'function'
      ? (values as (currentValues: U) => U)(state as State)
      : values

    if (newValues && !options.keepDefaultValues) {
      Object.assign(initialState, cloneObject(newValues))
    }

    const keysToReset = getObjectPaths(newValues)

    for (const key of keysToReset) {
      const value = get(newValues, key)
      resetField(key as Path<State>, {
        defaultValue: value,
        keepDirty: options.keepDirty,
        keepTouched: options.keepDirty,
        keepError: true
      })
    }

    if (!options.keepErrors) {
      for (const key of keysToReset) {
        clearErrors(key as Path<State> | RegExp)
      }
    }
  }

  function _updateFieldState<K extends Path<State>>(name: K, type: FormInputEvents, value: PathValue<State, K>) {
    touchedFields.add(name)

    if (type === 'blur') {
      blurredFields.add(name)
    } else if (type !== 'focus') {
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

  const _handleInputLogic = <K extends Path<State>>(name: K, value: PathValue<State, K>) => _updateFieldState(name,
    'input', value)
  const _handleChangeLogic = <K extends Path<State>>(name: K, value: PathValue<State, K>) => _updateFieldState(name,
    'change', value)
  const _handleBlurLogic = (name: Path<State>) => _updateFieldState(name,
    'blur', undefined!)
  const _handleFocusLogic = (name: Path<State>) => _updateFieldState(name,
    'focus', undefined!)

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

  function bind<K extends Path<State>>(name: K) {
    const getValue = getFieldValue(name)
    const fieldProps = {
      'name': name as string,
      'modelValue': getValue,
      'onUpdate:modelValue': (val: PathValue<State, K>) => {
        _handleInputLogic(name, val)
      },
      'onChange': (event: Event | CustomEvent) => {
        const value = getEventValue(event, getValue)
        _handleChangeLogic(name, value as PathValue<State, K>)
      },
      'onBlur': () => _handleBlurLogic(name),
      'onFocus': () => _handleFocusLogic(name)
    }

    return fieldProps
  }

  function handleBlur(event: FocusEvent) {
    const name = (event.target as HTMLInputElement).name as Path<State>
    if (!name) return
    _handleBlurLogic(name)
  }
  function handleFocus(event: FocusEvent) {
    const name = (event.target as HTMLInputElement).name as Path<State>
    if (!name) return
    _handleFocusLogic(name)
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    const name = target.name as Path<State>
    if (!name) return
    const value = target.type === 'checkbox' ? target.checked : target.value
    _handleInputLogic(name, value as any)
  }

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement
    const name = target.name as Path<State>
    if (!name) return
    const value = target.type === 'checkbox' ? target.checked : target.value
    _handleChangeLogic(name, value as any)
  }

  function setFieldError<K extends Path<State>>(name: K, error: Omit<FormErrorWithId, 'name'>) {
    if (name) {
      errors.value.push({
        ...error,
        name: name as string
      })
    }
  }

  function setErrors(errs: FormError[], name?: Path<State> | RegExp) {
    if (name) {
      errors.value = errors.value
        .filter(err => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name)
        .concat(resolveErrorIds(errs))
    } else {
      errors.value = resolveErrorIds(errs)
    }
  }

  function getErrors(name?: Path<State> | RegExp) {
    if (name) {
      return errors.value.filter(err => name instanceof RegExp ? err.name && name.test(err.name) : err.name === name)
    }
    return errors.value
  }

  function clearErrors(name?: Path<State> | RegExp) {
    if (name) {
      errors.value = errors.value.filter(err => name instanceof RegExp ? !(err.name && name.test(err.name)) : err.name !== name)
    } else {
      errors.value = []
    }
  }

  function getFieldValue<K extends Path<State>>(name: K): PathValue<State, K> | undefined {
    return get(state, name)
  }

  function setFieldValue<K extends Path<State>>(name: K, value: PathValue<State, K>) {
    if (!name) return

    set(state, name, value)
  }

  function watch<K extends Path<State>>(
    key: K,
    cb: WatchCallback<PathValue<State, K>, PathValue<State, K>>,
    options?: WatchOptions
  ): void
  function watch(
    cb: WatchCallback<Partial<State>, Partial<State>>,
    options?: WatchOptions
  ): void
  function watch<K extends Path<State>>(
    arg1: K | WatchCallback<Partial<State>, Partial<State> | undefined>,
    arg2?: WatchCallback<PathValue<State, K>, PathValue<State, K>> | WatchOptions,
    arg3?: WatchOptions
  ) {
    if (typeof arg1 === 'string') {
      vueWatch(() => getFieldValue(arg1 as unknown as Path<State>)!, arg2 as WatchCallback<PathValue<State, K>, PathValue<InferInput<S>, K> | undefined>, arg3)
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
    bind,
    handleBlur,
    handleInput,
    handleChange,
    handleFocus,
    setErrors,
    setFieldError,
    getErrors,
    clearErrors,
    setFieldValue,
    getFieldValue,
    watch,
    errorBag,
    resetField,
    reset,

    // Internal
    registerNestedForm,
    unregisterNestedForm

  }
}
