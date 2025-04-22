import { reactivePick } from '@vueuse/core'
import type { LinkProps } from '../types'

export function pickLinkProps(link: LinkProps & { [key: string]: any }) {
  const keys = Object.keys(link)

  const ariaKeys = keys.filter(key => key.startsWith('aria-'))
  const dataKeys = keys.filter(key => key.startsWith('data-'))

  const propsToInclude = [
    'active', 'activeClass', 'ariaCurrentValue', 'as', 'disabled',
    'exact', 'exactActiveClass', 'exactHash', 'exactQuery', 'external',
    'href', 'download', 'inactiveClass', 'noPrefetch', 'noRel', 'prefetch',
    'prefetchedClass', 'rel', 'replace', 'target', 'to', 'type', 'title',
    'onClick',
    ...ariaKeys,
    ...dataKeys
  ]

  return reactivePick(link, ...propsToInclude)
}
