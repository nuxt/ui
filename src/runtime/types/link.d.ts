import type { NuxtLinkProps } from '#app'

export interface Link extends NuxtLinkProps {
  as?: string
  type?: string
  disabled?: boolean
  active?: boolean
  exact?: boolean
  exactQuery?: boolean | 'partial'
  exactHash?: boolean
  inactiveClass?: string
}
