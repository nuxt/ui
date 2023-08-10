export interface FormError {
  path: string
  message: string
}

export interface Form<T> {
  validate(): Promise<T>
}

export interface FormEvent {
  type: 'blur' // | 'change' | 'focus'
  path: string
}
