import type { Link } from './link'
import type { Avatar } from './avatar'
import type { Badge } from './badge'

export interface VerticalNavigationLink extends Link {
  label: string
  labelClass?: string
  icon?: string
  iconClass?: string
  avatar?: Avatar
  click?: (...args: any[]) => void
  badge?: string | number | Badge
}
