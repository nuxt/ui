import { inject } from 'vue'
import { UseEventBusReturn } from '@vueuse/core'
import { FormEvent } from '../types'

export const useFormGroup = () => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formGroup = inject('form-group', undefined)

    const emitFormBlur = () => {
      if (formBus && formGroup) {
        formBus.emit({ type: 'blur', path: formGroup.name.value })
      }
    }

    return {
      emitFormBlur,
      formGroup
    }
}
