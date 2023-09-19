import { inject, ref } from 'vue'
import { type UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import type { FormEvent, FormEventType, InjectedFormGroupValue } from '../types/form'

type InputAttrs = {
  id?: string
}

export const useFormGroup = (inputAttrs?: InputAttrs) => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formGroup = inject<InjectedFormGroupValue>('form-group', undefined)

    if (formGroup) {
      formGroup.labelFor.value = inputAttrs?.id ?? formGroup?.labelFor.value
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
      emitFormBlur,
      emitFormInput,
      emitFormChange,
      formGroup
    }
}
