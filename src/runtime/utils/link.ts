import { reactivePick } from '@vueuse/core'
import { isEqual, diff } from 'ohash/utils'
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

export function isPartiallyEqual(item1: any, item2: any) {
  const diffedKeys = diff(item1, item2).reduce((filtered, q) => {
    if (q.type === 'added') {
      filtered.add(q.key)
    }
    return filtered
  }, new Set<string>())

  const item1Filtered = Object.fromEntries(Object.entries(item1).filter(([key]) => !diffedKeys.has(key)))
  const item2Filtered = Object.fromEntries(Object.entries(item2).filter(([key]) => !diffedKeys.has(key)))

  return isEqual(item1Filtered, item2Filtered)
}
