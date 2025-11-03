import { inject, computed, provide, watch } from 'vue'
import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { UseEventBusReturn } from '@vueuse/core'
import { useCustomControl } from '@formwerk/core'
import type { CustomControlProps } from '@formwerk/core'
import type { FormFieldProps } from '../types'
import type { FormErrorWithId, FormEvent, FormInputEvents, FormFieldInjectedOptions, FormInjectedOptions } from '../types/form'
import type { GetObjectField } from '../types/utils'

type Props<T> = {
  id?: string
  name?: string
  size?: GetObjectField<T, 'size'>
  color?: GetObjectField<T, 'color'>
  highlight?: boolean
  disabled?: boolean
}

export const formOptionsInjectionKey: InjectionKey<ComputedRef<FormInjectedOptions>> = Symbol('nuxt-ui.form-options')
export const formBusInjectionKey: InjectionKey<UseEventBusReturn<FormEvent<any>, string>> = Symbol('nuxt-ui.form-events')
export const formStateInjectionKey: InjectionKey<ComputedRef<Record<string, any> | undefined>> = Symbol('nuxt-ui.form-state')
export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>> | undefined> = Symbol('nuxt-ui.form-field')
export const inputIdInjectionKey: InjectionKey<Ref<string | undefined>> = Symbol('nuxt-ui.input-id')
export const formInputsInjectionKey: InjectionKey<Ref<Record<string, { id?: string, pattern?: RegExp }>>> = Symbol('nuxt-ui.form-inputs')
export const formLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol('nuxt-ui.form-loading')
export const formErrorsInjectionKey: InjectionKey<Readonly<Ref<FormErrorWithId[]>>> = Symbol('nuxt-ui.form-errors')

export function useFormField<T>(props?: Props<T>, opts: CustomControlProps = {}) {
  const formOptions = inject(formOptionsInjectionKey, undefined)
  const formBus = inject(formBusInjectionKey, undefined)
  const formField = inject(formFieldInjectionKey, undefined)

  // Blocks the FormField injection to avoid duplicating events when nesting input components.
  provide(formFieldInjectionKey, undefined)

  const name = computed(() => props?.name ?? formField?.value.name)
  const size = computed(() => props?.size ?? formField?.value.size)
  const color = computed(() => formField?.value.error ? 'error' : props?.color)
  const highlight = computed(() => formField?.value.error ? true : props?.highlight)
  const disabled = computed(() => formOptions?.value.disabled || props?.disabled)

  // Formmwerk control
  const { controlId, controlProps, field: { isDisabled, setValue, setTouched, setBlurred, isTouched, isBlurred, isDirty } } = useCustomControl({
    name: name.value,
    disabled: disabled.value,
    ...opts
  })

  function emitFormEvent(type: FormInputEvents, name?: string, payload?: unknown) {
    if (formBus && formField && name) {
      formBus.emit({ type, name, payload })
    }
  }

  watch(isTouched, newValue => emitFormEvent('touched', name.value, newValue))
  watch(isBlurred, newValue => emitFormEvent('blur', name.value, newValue))
  watch(isDirty, newValue => emitFormEvent('dirty', name.value, newValue))

  return {
    setValue,
    setTouched,
    setBlurred,
    isDisabled,
    isTouched,
    controlProps,
    controlId,
    name,
    size,
    color,
    highlight
  }
}
