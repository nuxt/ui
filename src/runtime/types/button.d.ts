export interface Button {
  type?: string
  block?: boolean
  label?: string
  loading?: boolean
  disabled?: boolean
  size?: string
  color?: string
  variant?: string
  icon?: string
  leadingIcon?: string
  trailingIcon?: string
  trailing?: boolean
  to?: string | object
  target?: string
  square?: boolean
  truncate?: boolean
}

export interface ButtonGroupContext {
  ui?: Partial<typeof appConfig.ui.buttonGroup>,
  size?: string,
  class?: string
}

export interface ButtonGroupInjection {
  onRender (context: ButtonGroupContext): void
}
