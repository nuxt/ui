import type { PropType } from 'vue'
import type { RouteLocationRaw } from '#vue-router'

export const nuxtLinkProps = {
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined
  },
  href: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: undefined
  },
  // Attributes
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & {}) | null>,
    default: undefined
  },
  rel: {
    type: String,
    default: undefined
  },
  noRel: {
    type: Boolean,
    default: undefined
  },
  // Prefetching
  prefetch: {
    type: Boolean,
    default: undefined
  },
  noPrefetch: {
    type: Boolean,
    default: undefined
  },
  // Styling
  activeClass: {
    type: String,
    default: undefined
  },
  exactActiveClass: {
    type: String,
    default: undefined
  },
  prefetchedClass: {
    type: String,
    default: undefined
  },
  // Vue Router's `<RouterLink>` additional props
  replace: {
    type: Boolean,
    default: undefined
  },
  ariaCurrentValue: {
    type: String,
    default: undefined
  },
  // Edge cases handling
  external: {
    type: Boolean,
    default: undefined
  }
} as const
