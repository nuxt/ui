import { shallowReactive, reactive, useTemplateRef, type ShallowUnwrapRef } from 'vue'
import type { Form, FormSchema, InferInput } from '../types/form'
import { cloneObject } from '../utils'

export interface UseFormControlOptions<S extends FormSchema> {
  id?: string | number
  schema?: S
  defaultValues?: Partial<InferInput<S>>
  values?: Partial<InferInput<S>>
  shallow?: boolean
  formRefName?: string
}

export function useFormControl<S extends FormSchema>(options: UseFormControlOptions<S>) {
  const formRef = useTemplateRef<ShallowUnwrapRef<Form<S>>>(options.formRefName || 'formRef')

  const initialState: Partial<InferInput<S>> = cloneObject(options.defaultValues) ?? {} as InferInput<S>

  const state = (options.shallow ? shallowReactive : reactive)(options.values ?? initialState) as (Partial<InferInput<S>>)

  return {
    formRef,
    state
  }
}
