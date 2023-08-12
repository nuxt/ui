import { inject } from 'vue'
import { UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import { FormEvent, FormEventType } from '../types'

export const useFormGroup = () => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formGroup = inject('form-group', undefined)

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
