export interface FormError {
  path: string
  message: string
}

export interface Form<T> {
  async validate(): T
}

export interface Form {
  async validate(): any
}
