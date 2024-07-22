import { inject, ref, computed } from 'vue'
import { type UseEventBusReturn, useDebounceFn } from '@vueuse/core'
import type { FormEvent, FormEventType, InjectedFormGroupValue } from '../types/form'
import { mergeConfig } from '../utils'
// @ts-expect-error
import appConfig from '#build/app.config'
import { formGroup } from '#ui/ui.config'

type InputProps = {
  id?: string
  size?: string | number | symbol
  color?: string
  name?: string
  eagerValidation?: boolean
  legend?: string | null
}


const formGroupConfig = mergeConfig<typeof formGroup>(appConfig.ui.strategy, appConfig.ui.formGroup, formGroup)

export const useFormGroup = (inputProps?: InputProps, config?: any) => {
  const formBus = inject<UseEventBusReturn<FormEvent, string> | undefined>('form-events', undefined)
  const formGroup = inject<InjectedFormGroupValue | undefined>('form-group', undefined)
  const formInputs = inject<any>('form-inputs', undefined)

  if (formGroup) {
    if (inputProps?.id) {
      // Updates for="..." attribute on label if inputProps.id is provided
      formGroup.inputId.value = inputProps?.id
    }

    if (formInputs) {
      formInputs.value[formGroup.name.value] = formGroup.inputId.value
    }
  }

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
    inputId: computed(() => inputProps?.id ?? formGroup?.inputId.value),
    name: computed(() => inputProps?.name ?? formGroup?.name.value),
    size: computed(() => {
      const formGroupSize = config.size[formGroup?.size.value as string] ? formGroup?.size.value : null
      return inputProps?.size ?? formGroupSize ?? formGroupConfig?.default?.size
    }),
    color: computed(() => formGroup?.error?.value ? 'red' : inputProps?.color),
    emitFormBlur,
    emitFormInput,
    emitFormChange
  }
}
