import type { Link } from './link'

export interface BreadcrumbItem extends Link {
  text: string
  icon?: string
  tag?: string
}
