import { inject } from 'vue'
import { UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import { FormEvent } from '../types'

export const useFormGroup = () => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formGroup = inject('form-group', undefined)

    const formPath = inject<string | undefined>('form-path', undefined)
    const blurred = ref(false)
    const emitFormBlur = () => {
      if (formBus && formPath) {
        formBus.emit({ type: 'blur', path: formGroup.name.value })
        blurred.value = true
      }
    }

    const emitFormInput = useDebounceFn(() => {
      if (formBus && formPath && blurred.value) {
        formBus.emit({ type: 'input', path: formPath })
      }
    }, 200)

    return {
      emitFormBlur,
      emitFormInput,
      formGroup
    }
}
