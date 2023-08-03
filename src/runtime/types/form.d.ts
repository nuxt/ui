export interface FormError {
  path: string
  message: string
}

export interface Form<T> {
  validate(path: string, opts: { silent?: boolean } = { silent: false }): Promise<T>
  clear(path?: string): void
  errors: Ref<FormError[]>
  setErrors(errs: FormError[]): void
  clear(path?: string): void
}

export interface FormEvent {
  type: 'blur' | 'input'
  path: string
}
