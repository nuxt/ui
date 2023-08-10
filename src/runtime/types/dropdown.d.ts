import type { Link } from './link'
import type { Avatar } from './avatar'

export interface DropdownItem extends Link {
  label: string
  slot?: string
  icon?: string
  iconClass?: string
  avatar?: Avatar
  shortcuts?: string[]
  disabled?: boolean
  click?: Function
}
