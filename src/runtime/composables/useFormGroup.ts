import { inject, ref, computed } from 'vue'
import { type UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import type { FormEvent, FormEventType, InjectedFormGroupValue } from '../types/form'

type InputProps = {
  id?: string
  size?: string
  color?: string
  name?: string
}

export const useFormGroup = (inputProps?: InputProps, config?: any) => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formGroup = inject<InjectedFormGroupValue>('form-group', undefined)

    if (formGroup) {
      // Updates for="..." attribute on label if inputProps.id is provided
      formGroup.inputId.value = inputProps?.id ?? formGroup?.inputId.value
    }

    const blurred = ref(false)

    function emitFormEvent (type: FormEventType, path: string) {
      if (formBus) {
        formBus.emit({ type, path })
      }
    }

    function emitFormBlur () {
      emitFormEvent('blur', formGroup?.name.value)
      blurred.value = true
    }

    function emitFormChange () {
      emitFormEvent('change', formGroup?.name.value)
    }

    const emitFormInput = useDebounceFn(() => {
      if (blurred.value) {
        emitFormEvent('input', formGroup?.name.value)
      }
    }, 300)

    return {
      inputId: computed(() => inputProps.id ?? formGroup?.inputId.value),
      name: computed(() => inputProps?.name ?? formGroup?.name.value),
      size: computed(() => inputProps?.size ?? formGroup?.size.value ?? config?.default?.size),
      color: computed(() => formGroup?.error?.value ? 'red' : inputProps?.color),
      emitFormBlur,
      emitFormInput,
      emitFormChange
    }
}
