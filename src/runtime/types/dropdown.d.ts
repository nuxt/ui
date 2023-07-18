import type { RouteLocationRaw } from 'vue-router'
import type { Avatar } from './avatar'

export interface DropdownItem {
  to?: string | RouteLocationRaw
  exact?: boolean
  label: string
  slot?: string
  icon?: string
  iconClass?: string
  avatar?: Partial<Avatar>
  shortcuts?: string[]
  disabled?: boolean
  click?: Function
}
