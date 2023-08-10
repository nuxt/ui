import type { NuxtLinkProps } from '#app'

export interface Link extends NuxtLinkProps {
  exact?: boolean
  exactQuery?: boolean
  exactMatch?: boolean
  inactiveClass?: string
}
