import type { Link } from './link'

export interface BreadcrumbLink extends Link {
  label: string
  icon?: string
  iconClass?: string
}
