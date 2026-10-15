import { isEqual, diff } from 'ohash/utils'
import type { LinkProps } from '../components/Link.vue'
import { linkKeys } from './link-keys'

export { linkKeys }

const linkKeySet = new Set<string>(linkKeys)

export function pickLinkProps(link: LinkProps & { [key: string]: any }) {
  const picked: Record<string, any> = {}
  for (const key of Object.keys(link)) {
    if (linkKeySet.has(key) || key.startsWith('aria-') || key.startsWith('data-')) {
      picked[key] = link[key]
    }
  }
  return picked
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
