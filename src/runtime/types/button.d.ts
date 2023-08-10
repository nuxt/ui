import type { Link } from './link'

export interface Button extends Link {
  type?: string
  block?: boolean
  label?: string
  loading?: boolean
  disabled?: boolean
  padded?: boolean
  size?: string
  color?: string
  variant?: string
  icon?: string
  loadingIcon?: string
  leadingIcon?: string
  trailingIcon?: string
  trailing?: boolean
  leading?: boolean
  to?: string | object
  target?: string
  square?: boolean
  truncate?: boolean
}
