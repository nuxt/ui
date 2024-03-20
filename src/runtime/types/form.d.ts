import type { ComputedRef, Ref } from 'vue'

export interface Form<T> {
  validate (path?: string | string[], opts?: { silent?: true }): Promise<T | false>
  validate (path?: string | string[], opts?: { silent?: false }): Promise<T | false>
  clear (path?: string): void
  errors: Ref<FormError[]>
  setErrors (errs: FormError[], path?: string): void
  getErrors (path?: string): FormError[]
  submit (): Promise<void>
  disabled: ComputedRef<boolean>
}

export type FormSchema<T extends object> =
  | ZodSchema
  | YupObjectSchema<T>
  | ValibotObjectSchema<T>
  | JoiSchema<T>

export type FormInputEvents = 'input' | 'blur' | 'change'

export interface FormError<P extends string = string> {
  name: P
  message: string
}

export interface FormErrorWithId extends FormError {
  id: string
}

export type FormSubmitEvent<T> = SubmitEvent & { data: T }
export type FormErrorEvent = SubmitEvent & { errors: FormErrorWithId[] }

export type FormEventType = FormInputEvents | 'submit'

export interface FormEvent {
  type: FormEventType
  name?: string
}

export interface InjectedFormFieldOptions<T> {
  inputId: Ref<string | undefined>
  name: ComputedRef<string | undefined>
  size: ComputedRef<T['size']>
  error: ComputedRef<string | boolean | undefined>
  eagerValidation: ComputedRef<boolean | undefined>
  validateOnInputDelay: ComputedRef<number | undefined>
}

export interface InjectedFormOptions {
  disabled?: ComputedRef<boolean>
  validateOnInputDelay?: ComputedRef<number>
}
