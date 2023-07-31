import type { Link } from './link'
import type { Avatar } from './avatar'

export interface VerticalNavigationLink extends Link {
  label: string
  icon?: string
  iconClass?: string
  avatar?: Avatar
  click?: Function
  badge?: string | number
}
