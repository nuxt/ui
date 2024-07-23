import type { Ref } from 'vue'

export interface FormError<T extends string = string> {
  path: T
  message: string
}

export interface FormErrorWithId extends FormError {
  id: string
}

export interface Form<T> {
  validate(path?: string | string[], opts?: { silent?: true }): Promise<T | false>;
  validate(path?: string | string[], opts?: { silent?: false }): Promise<T>;
  clear(path?: string): void
  errors: Ref<FormError[]>
  setErrors(errs: FormError[], path?: string): void
  getErrors(path?: string): FormError[]
  submit(): Promise<void>
}

export type FormSubmitEvent<T> = SubmitEvent & { data: T }
export type FormErrorEvent = SubmitEvent & { errors: FormErrorWithId[] }

export type FormEventType = 'blur' | 'input' | 'change' | 'submit'

export interface FormEvent {
  type: FormEventType
  path?: string
}

export interface InjectedFormGroupValue {
  inputId: Ref<string | undefined>
  name: Ref<string>
  size: Ref<string | number | symbol>
  error: Ref<string | boolean | undefined>
  eagerValidation: Ref<boolean>
}
