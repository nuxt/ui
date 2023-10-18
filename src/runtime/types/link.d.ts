import type { NuxtLinkProps } from '#app'

export interface Link extends NuxtLinkProps {
  active?: boolean
  exact?: boolean
  exactQuery?: boolean
  exactMatch?: boolean
  inactiveClass?: string
}
