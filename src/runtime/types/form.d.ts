export interface FormError {
  path: string
  message: string
}

export interface Form<T> {
  validate(path: string, opts: { silent?: boolean } = { silent: false }): Promise<T>
  clear(path?: string): void
  errors: Ref<FormError[]>
}

export interface FormEvent {
  type: 'blur' | 'input'
  path: string
}
