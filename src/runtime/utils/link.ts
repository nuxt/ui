import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

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

const uLinkProps = {
  active: {
    type: Boolean,
    default: undefined
  },
  exact: {
    type: Boolean,
    default: false
  },
  exactQuery: {
    type: Boolean,
    default: false
  },
  exactHash: {
    type: Boolean,
    default: false
  },
  inactiveClass: {
    type: String,
    default: undefined
  }
} as const

export const getNuxtLinkProps = (props) => {
  const keys = Object.keys(nuxtLinkProps)

  return keys.reduce((acc, key) => {
    if (props[key] !== undefined) {
      acc[key] = props[key]
    }
    return acc
  }, {})
}

export const getULinkProps = (props) => {
  const keys = [...Object.keys(nuxtLinkProps), ...Object.keys(uLinkProps)]

  return keys.reduce((acc, key) => {
    if (props[key] !== undefined) {
      acc[key] = props[key]
    }
    return acc
  }, {})
}
