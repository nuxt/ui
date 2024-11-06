import type { AppConfig } from 'nuxt/schema'
import type { button } from '../ui.config'
import type { Link } from './link'
import type { NestedKeyOf, ExtractDeepKey, ExtractDeepObject } from '.'
import type colors from '#ui-colors'

export type ButtonSize = keyof typeof button.size | ExtractDeepKey<AppConfig, ['ui', 'button', 'size']>
export type ButtonColor = keyof typeof button.color | ExtractDeepKey<AppConfig, ['ui', 'button', 'color']> | typeof colors[number]
export type ButtonVariant = keyof typeof button.variant | ExtractDeepKey<AppConfig, ['ui', 'button', 'variant']> | NestedKeyOf<typeof button.color> | NestedKeyOf<ExtractDeepObject<AppConfig, ['ui', 'button', 'color']>>

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
  square?: boolean
  truncate?: boolean
  target?: string
}
