import type { Avatar } from './avatar'
import type { NuxtLinkProps } from '#app'

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
  click?: (...args: any[]) => void
}
