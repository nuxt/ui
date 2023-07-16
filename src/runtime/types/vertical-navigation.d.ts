import type { RouteLocationRaw } from 'vue-router'
import type { Avatar } from './avatar'

export interface Link {
  to?: string | RouteLocationRaw
  exact?: boolean
  label: string
  icon?: string
  iconClass?: string
  avatar?: Partial<Avatar>
  click?: Function
  badge?: string | number
}
