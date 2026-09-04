import { reactivePick } from '@vueuse/core'
import { isEqual, diff } from 'ohash/utils'
import type { LinkProps } from '../components/Link.vue'
import { linkKeys } from './link-keys'

export { linkKeys }

export function pickLinkProps(link: LinkProps & { [key: string]: any }) {
  const keys = Object.keys(link)

  const ariaKeys = keys.filter(key => key.startsWith('aria-'))
  const dataKeys = keys.filter(key => key.startsWith('data-'))

  const propsToInclude = [
    ...linkKeys,
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

// Prefetch helpers used by `LinkBase`. That component is also bundled for the
// Vue builds, so nothing here can import from `#imports` or `#app`.

type IdleCallbackHandle = ReturnType<typeof setTimeout> | number

// Mirrors Nuxt's `requestIdleCallback` compat: falls back to a short timeout
// when the browser (or happy-dom in tests) does not implement it.
export function requestIdleCallback(callback: () => void): IdleCallbackHandle | undefined {
  if (typeof window === 'undefined') {
    return
  }

  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(callback)
  }

  return setTimeout(callback, 1)
}

export function cancelIdleCallback(handle: IdleCallbackHandle | undefined) {
  if (typeof window === 'undefined' || handle === undefined) {
    return
  }

  if (typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(handle as number)
    return
  }

  clearTimeout(handle as ReturnType<typeof setTimeout>)
}

let observer: IntersectionObserver | null = null
const callbacks = new Map<Element, () => void>()

// One `IntersectionObserver` shared by every link, like NuxtLink's own observer:
// creating one per link is wasteful for navigations with hundreds of entries.
export function observeIntersection(element: Element, callback: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    return () => {}
  }

  observer ||= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const callback = callbacks.get(entry.target)
      if ((entry.isIntersecting || entry.intersectionRatio > 0) && callback) {
        callback()
      }
    }
  })

  callbacks.set(element, callback)
  observer.observe(element)

  return () => {
    callbacks.delete(element)
    observer?.unobserve(element)

    if (callbacks.size === 0) {
      observer?.disconnect()
      observer = null
    }
  }
}
