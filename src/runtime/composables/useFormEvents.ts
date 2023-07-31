import { inject } from 'vue'
import { UseEventBusReturn } from '@vueuse/core'
import { FormEvent } from '../types'

export const useFormEvents = () => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formPath = inject<string | undefined>('form-path', undefined)

    const emitFormBlur = () => {
      if (formBus && formPath) {
        formBus.emit({ type: 'blur', path: formPath })
      }
    }

    return {
      emitFormBlur
    }
}
