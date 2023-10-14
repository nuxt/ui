import { badge } from '../ui.config'
import type { NestedKeyOf } from '.'
import colors from '#ui-colors'

export type BadgeSize = keyof typeof badge.size
export type BadgeColor = keyof typeof badge.color | typeof colors[number]
export type BadgeVariant = keyof typeof badge.variant | NestedKeyOf<typeof badge.color>

export interface Badge {
  label?: string
  size?: BadgeSize
  color?: BadgeColor
  variant?: BadgeVariant
}
