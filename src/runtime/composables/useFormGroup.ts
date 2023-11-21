import { inject, ref, computed, onMounted } from 'vue'
import { type UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import type { FormEvent, FormEventType, InjectedFormGroupValue } from '../types/form'
import { uid } from '../utils/uid'

type InputProps = {
  id?: string | null
  size?: string | number | symbol
  color?: string
  name?: string
  isFieldset?: boolean
  eagerValidation?: boolean
}

export const useFormGroup = (inputProps?: InputProps, config?: any) => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formGroup = inject<InjectedFormGroupValue | undefined>('form-group', undefined)
    const formInputs = inject<any>('form-inputs', undefined)

    const inputId = ref(inputProps?.id)

    onMounted(() => {
      inputId.value = inputProps?.isFieldset ? null : inputProps?.id ?? uid()

      if (formGroup) {
        // Updates for="..." attribute on label if inputProps.id is provided
        formGroup.inputId.value = inputId.value

        if (formInputs) {
          formInputs.value[formGroup.name.value] = inputId
        }
      }
    })

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
      if (blurred.value || formGroup?.eagerValidation.value) {
        emitFormEvent('input', formGroup?.name.value)
      }
    }, 300)

    return {
      inputId,
      name: computed(() => inputProps?.name ?? formGroup?.name.value),
      size: computed(() => {
        const formGroupSize = config.size[formGroup?.size.value] ? formGroup?.size.value : null
        return inputProps?.size ?? formGroupSize ?? config?.default?.size
      }),
      color: computed(() => formGroup?.error?.value ? 'red' : inputProps?.color),
      emitFormBlur,
      emitFormInput,
      emitFormChange
    }
}
