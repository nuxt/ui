import { inject } from 'vue'
import { UseEventBusReturn } from '@vueuse/core'

export interface FormError {
  path: string
  message: string
}

export interface Form<T> {
  validate(): Promise<T>
}

export interface FormEvent {
  type: 'blur' // | 'change' | 'focus'
  path: string
}

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
