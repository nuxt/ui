import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ComputedRef, DeepReadonly, Ref } from 'vue'
import type { Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema } from 'yup'
import type { GetObjectField } from './utils'
import type { Struct as SuperstructSchema } from 'superstruct'

export interface Form<S extends FormSchema> {
  validate<T extends boolean>(opts?: { name?: keyof FormData<S, false> | (keyof FormData<S, false>)[], silent?: boolean, nested?: boolean, transform?: T }): Promise<FormData<S, T> | false>
  clear (path?: string): void
  errors: Ref<FormError[]>
  setErrors (errs: FormError[], name?: keyof FormData<S, false>): void
  getErrors (name?: keyof FormData<S, false>): FormError[]
  submit (): Promise<void>
  disabled: ComputedRef<boolean>
  dirty: ComputedRef<boolean>
  loading: Ref<boolean>

  dirtyFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>
  touchedFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>
  blurredFields: ReadonlySet<DeepReadonly<keyof FormData<S, false>>>
}

export type FormSchema<I extends object = object, O extends object = I>
  = | YupObjectSchema<I>
    | JoiSchema<I>
    | SuperstructSchema<any, any>
    | StandardSchemaV1<I, O>

// Define a utility type to infer the input type based on the schema type
export type InferInput<Schema> = Schema extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Schema>
  : Schema extends YupObjectSchema<infer I> ? I
    : Schema extends JoiSchema<infer I> ? I
      : Schema extends SuperstructSchema<infer I, any> ? I
        : Schema extends StandardSchemaV1 ? StandardSchemaV1.InferInput<Schema>
          : never

// Define a utility type to infer the output type based on the schema type
export type InferOutput<Schema> = Schema extends StandardSchemaV1 ? StandardSchemaV1.InferOutput<Schema>
  : Schema extends YupObjectSchema<infer O> ? O
    : Schema extends JoiSchema<infer O> ? O
      : Schema extends SuperstructSchema<infer O, any> ? O
        : never

export type FormData<S extends FormSchema, T extends boolean = true> = T extends true ? InferOutput<S> : InferInput<S>

export type FormInputEvents = 'input' | 'blur' | 'change' | 'focus'

export interface FormError<P extends string = string> {
  name?: P
  message: string
}

export interface FormErrorWithId extends FormError {
  id?: string
}

export type FormSubmitEvent<T> = SubmitEvent & { data: T }

export type FormValidationError = {
  errors: FormErrorWithId[]
  children?: FormValidationError[]
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

export type FormInputEvent<T extends object> = {
  type: FormEventType
  name: keyof T
  eager?: boolean
}

export type FormEvent<T extends object>
  = | FormInputEvent<T>
    | FormChildAttachEvent
    | FormChildDetachEvent

export interface FormInjectedOptions {
  disabled?: boolean
  validateOnInputDelay?: number
}

export interface FormFieldInjectedOptions<T> {
  name?: string
  size?: GetObjectField<T, 'size'>
  error?: string | boolean
  eagerValidation?: boolean
  validateOnInputDelay?: number
  errorPattern?: RegExp
  hint?: string
  description?: string
  help?: string
  ariaId: string
}

export interface ValidateReturnSchema<T> {
  result: T
  errors: FormError[] | null
}

export class FormValidationException extends Error {
  formId: string | number
  errors: FormErrorWithId[]
  children?: FormValidationException[]

  constructor(formId: string | number, errors: FormErrorWithId[], childErrors?: FormValidationException[]) {
    super('Form validation exception')
    this.formId = formId
    this.errors = errors
    this.children = childErrors
    Object.setPrototypeOf(this, FormValidationException.prototype)
  }
}
