import type { Link } from './link'

export interface Button extends Link {
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
