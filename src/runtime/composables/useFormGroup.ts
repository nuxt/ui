import { inject, ref, computed, onMounted } from 'vue'
import { type UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import type { FormEvent, FormEventType, InjectedFormGroupValue } from '../types/form'
import { uid } from '../utils/uid'

type InputProps = {
  id?: string
  size?: string | number | symbol
  color?: string
  name?: string
  eagerValidation?: boolean
  legend?: string | null
}

export const useFormGroup = (inputProps?: InputProps, config?: any) => {
    const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
    const formGroup = inject<InjectedFormGroupValue | undefined>('form-group', undefined)
    const formInputs = inject<any>('form-inputs', undefined)

    const inputId = ref(inputProps?.id)

    onMounted(() => {
      // Remove FormGroup label bindings for RadioGroup elements to avoid label conflicts
      inputId.value = inputProps?.legend === null || inputProps.legend ? undefined : inputProps?.id ?? uid()

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
      emitFormEvent('blur', formGroup?.name.value as string)
      blurred.value = true
    }

    function emitFormChange () {
      emitFormEvent('change', formGroup?.name.value as string)
    }

    const emitFormInput = useDebounceFn(() => {
      if (blurred.value || formGroup?.eagerValidation.value) {
        emitFormEvent('input', formGroup?.name.value as string)
      }
    }, 300)

    return {
      inputId,
      name: computed(() => inputProps?.name ?? formGroup?.name.value),
      size: computed(() => {
        const formGroupSize = config.size[formGroup?.size.value as string] ? formGroup?.size.value : null
        return inputProps?.size ?? formGroupSize ?? config?.default?.size
      }),
      color: computed(() => formGroup?.error?.value ? 'red' : inputProps?.color),
      emitFormBlur,
      emitFormInput,
      emitFormChange
    }
}
