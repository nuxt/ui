import type { Link } from './link'

export interface BreadcrumbLink extends Link {
  label: string
  labelClass?: string
  icon?: string
  iconClass?: string
  // FIXME: This is a workaround for `link.to` not being resolved although it extends `NuxtLinkProps`
  [key: string]: any
}
