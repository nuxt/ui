import { reactivePick } from '@vueuse/core'
import { isEqual, diff } from 'ohash/utils'
import type { LinkProps } from '../types'

export const linkKeys = [
  'active',
  'activeClass',
  'ariaCurrentValue',
  'disabled',
  'download',
  'exact',
  'exactActiveClass',
  'exactHash',
  'exactQuery',
  'external',
  'href',
  'inactiveClass',
  'noPrefetch',
  'noRel',
  'prefetch',
  'prefetchedClass',
  'prefetchOn',
  'rel',
  'replace',
  'target',
  'title',
  'to',
  'trailingSlash',
  'viewTransition'
] as const

export type Link = Pick<LinkProps, (typeof linkKeys)[number]> & { [key: string]: any }

export function pickLinkProps(link: Link) {
  const keys = Object.keys(link)

  const ariaKeys = keys.filter(key => key.startsWith('aria-'))
  const dataKeys = keys.filter(key => key.startsWith('data-'))

  const propsToInclude = [
    ...linkKeys,
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
