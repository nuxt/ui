import { badge } from '../ui.config'
import type { NestedKeyOf } from '.'
import colors from '#ui-colors'
import type { AppConfig } from 'nuxt/schema'

export type BadgeSize = keyof typeof badge.size | keyof AppConfig['ui']['badge']['size']
export type BadgeColor = keyof typeof badge.color | keyof AppConfig['ui']['badge']['color'] | typeof colors[number]
export type BadgeVariant = keyof typeof badge.variant | keyof AppConfig['ui']['badge']['variant'] | NestedKeyOf<typeof badge.color> | NestedKeyOf<AppConfig['ui']['badge']['color']>

export interface Badge {
  label?: string
  size?: BadgeSize
  color?: BadgeColor
  variant?: BadgeVariant
}
