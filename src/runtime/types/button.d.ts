import type { Link } from './link'
import { button } from '../ui.config'
import type { NestedKeyOf } from '.'
import colors from '#ui-colors'

export type ButtonSize = keyof typeof button.size
export type ButtonColor = keyof typeof button.color | typeof colors[number]
export type ButtonVariant = keyof typeof button.variant | NestedKeyOf<typeof button.color>

export interface Button extends Link {
  type?: string
  block?: boolean
  label?: string
  loading?: boolean
  disabled?: boolean
  padded?: boolean
  size?: ButtonSize
  color?: ButtonColor
  variant?: ButtonVariant
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
