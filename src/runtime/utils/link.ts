import { reactivePick } from '@vueuse/core'
import type { LinkProps } from '../types'

export function pickLinkProps(link: LinkProps) {
  return reactivePick(link, 'active', 'activeClass', 'ariaCurrentValue', 'as', 'disabled', 'exact', 'exactActiveClass', 'exactHash', 'exactQuery', 'external', 'href', 'inactiveClass', 'noPrefetch', 'noRel', 'prefetch', 'prefetchedClass', 'rel', 'replace', 'target', 'to', 'type')
}
