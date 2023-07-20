import type { NuxtLinkProps } from '#app'
import type { Avatar } from './avatar'

export interface DropdownItem extends NuxtLinkProps {
  label: string
  slot?: string
  icon?: string
  iconClass?: string
  avatar?: Partial<Avatar>
  shortcuts?: string[]
  disabled?: boolean
  click?: Function
}
