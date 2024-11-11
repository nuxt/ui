import { inject, ref, computed, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import { type UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import type { FormFieldProps } from '../types'
import type { FormEvent, FormInputEvents, FormFieldInjectedOptions, FormInjectedOptions } from '../types/form'
import type { GetObjectField } from '../types/utils'

type Props<T> = {
  id?: string
  name?: string
  size?: GetObjectField<T, 'size'>
  color?: GetObjectField<T, 'color'>
  eagerValidation?: boolean
  legend?: string
  highlight?: boolean
  disabled?: boolean
}

export const formOptionsInjectionKey: InjectionKey<ComputedRef<FormInjectedOptions>> = Symbol('nuxt-ui.form-options')
export const formBusInjectionKey: InjectionKey<UseEventBusReturn<FormEvent, string>> = Symbol('nuxt-ui.form-events')
export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>>> = Symbol('nuxt-ui.form-field')
export const inputIdInjectionKey: InjectionKey<Ref<string | undefined>> = Symbol('nuxt-ui.input-id')
export const formInputsInjectionKey: InjectionKey<Ref<Record<string, { id?: string, pattern?: RegExp }>>> = Symbol('nuxt-ui.form-inputs')
export const formLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('nuxt-ui.form-loading')

export function useFormField<T>(props?: Props<T>, opts?: { bind?: boolean }) {
  const formOptions = inject(formOptionsInjectionKey, undefined)
  const formBus = inject(formBusInjectionKey, undefined)
  const formField = inject(formFieldInjectionKey, undefined)
  const formInputs = inject(formInputsInjectionKey, undefined)
  const inputId = inject(inputIdInjectionKey, undefined)

  if (formField && inputId) {
    if (opts?.bind === false || props?.legend) {
      // Removes for="..." attribute on label for RadioGroup and alike.
      inputId.value = undefined
    } else if (props?.id) {
      // Updates for="..." attribute on label if props.id is provided.
      inputId.value = props?.id
    }
    if (formInputs && formField.value.name && inputId.value) {
      formInputs.value[formField.value.name] = { id: inputId.value, pattern: formField.value.errorPattern }
    }
  }

  const blurred = ref(false)

  function emitFormEvent(type: FormInputEvents, name?: string) {
    if (formBus && formField && name) {
      formBus.emit({ type, name })
    }
  }

  function emitFormBlur() {
    emitFormEvent('blur', formField?.value.name)
    blurred.value = true
  }

  function emitFormChange() {
    emitFormEvent('change', formField?.value.name)
  }

  const emitFormInput = useDebounceFn(
    () => {
      emitFormEvent('input', formField?.value.name)
    },
    formField?.value.validateOnInputDelay ?? formOptions?.value.validateOnInputDelay ?? 0
  )

  return {
    id: computed(() => props?.id ?? inputId?.value),
    name: computed(() => props?.name ?? formField?.value.name),
    size: computed(() => props?.size ?? formField?.value.size),
    color: computed(() => formField?.value.error ? 'error' : props?.color),
    highlight: computed(() => formField?.value.error ? true : props?.highlight),
    disabled: computed(() => formOptions?.value.disabled || props?.disabled),
    emitFormBlur,
    emitFormInput,
    emitFormChange
  }
}
