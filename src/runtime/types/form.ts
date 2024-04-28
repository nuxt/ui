import type { ComputedRef, Ref } from 'vue'
import type { ZodSchema } from 'zod'
import type { Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema } from 'yup'
import type { ObjectSchemaAsync as ValibotObjectSchema } from 'valibot'

export interface Form<T> {
  validate (opts?: { name: string | string[], silent?: false, nested?: boolean }): Promise<T | false>
  clear (path?: string): void
  errors: Ref<FormError[]>
  setErrors (errs: FormError[], path?: string): void
  getErrors (path?: string): FormError[]
  submit (): Promise<void>
  disabled: ComputedRef<boolean>
}

export type FormSchema<T extends Record<string, any>> =
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

export type FormValidationError = {
  errors: FormErrorWithId[]
  childrens: FormValidationError[]
}

export type FormErrorEvent = SubmitEvent & FormValidationError

export type FormEventType = FormInputEvents

export type FormChildAttachEvent = {
  type: 'attach'
  formId: string | number
  validate: Form<any>['validate']
}

export type FormChildDetachEvent = {
  type: 'detach'
  formId: string | number
}

export type FormInputEvent = {
  type: FormEventType
  name?: string
}

export type FormEvent =
  | FormInputEvent
  | FormChildAttachEvent
  | FormChildDetachEvent

export interface FormInjectedOptions {
  disabled?: ComputedRef<boolean>
  validateOnInputDelay?: ComputedRef<number>
}

export interface FormFieldInjectedOptions<T> {
  id: Ref<string | undefined>
  name: ComputedRef<string | undefined>
  // @ts-expect-error FIXME: TS doesn't like this
  size: ComputedRef<T['size']>
  error: ComputedRef<string | boolean | undefined>
  eagerValidation: ComputedRef<boolean | undefined>
  validateOnInputDelay: ComputedRef<number | undefined>
}

export class FormValidationException extends Error {
  formId: string | number
  errors: FormErrorWithId[]
  childrens: FormValidationException[]

  constructor(formId: string | number, errors: FormErrorWithId[], childErrors: FormValidationException[]) {
    super('Form validation exception')
    this.formId = formId
    this.errors = errors
    this.childrens = childErrors
    Object.setPrototypeOf(this, FormValidationException.prototype)
  }
}
