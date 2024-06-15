import type { NuxtLinkProps } from '#app'
import type { Avatar } from './avatar'

export interface DropdownItem extends NuxtLinkProps {
  label: string
  labelClass?: string
  slot?: string
  icon?: string
  iconClass?: string
  avatar?: Avatar
  shortcuts?: string[]
  disabled?: boolean
  class?: string
  click?: Function
}
