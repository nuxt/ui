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
  disabled?: boolean
}

export const formOptionsInjectionKey: InjectionKey<ComputedRef<FormInjectedOptions>> = Symbol('nuxt-ui.form-options')
export const formBusInjectionKey: InjectionKey<UseEventBusReturn<FormEvent, string>> = Symbol('nuxt-ui.form-events')
export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>>> = Symbol('nuxt-ui.form-field')
export const formInputsInjectionKey: InjectionKey<Ref<Record<string, string>>> = Symbol('nuxt-ui.form-inputs')

export function useFormField<T>(props?: Props<T>) {
  const formOptions = inject(formOptionsInjectionKey, undefined)
  const formBus = inject(formBusInjectionKey, undefined)
  const formField = inject(formFieldInjectionKey, undefined)
  const formInputs = inject(formInputsInjectionKey, undefined)

  if (formField) {
    if (props?.id) {
      // Updates for="..." attribute on label if props.id is provided
      formField.value.id = props?.id
    }

    if (formInputs && formField.value.name) {
      formInputs.value[formField.value.name] = formField.value.id
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
    id: computed(() => props?.id ?? formField?.value.id),
    name: computed(() => props?.name ?? formField?.value.name),
    size: computed(() => props?.size ?? formField?.value.size),
    color: computed(() => formField?.value.error ? 'red' : props?.color),
    disabled: computed(() => formOptions?.value.disabled || props?.disabled),
    emitFormBlur,
    emitFormInput,
    emitFormChange
  }
}
