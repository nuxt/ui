import type { FunctionalComponent } from 'vue'
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

/**
 * Stands in for a `custom` Link that has no `to` or `href`: it passes its slot
 * the props Link would, without Link's setup and router work. A single child is
 * returned as is, so the parent's `$el` stays the element.
 */
export const LinkSlot: FunctionalComponent<{ as?: string, type?: string, disabled?: boolean, active?: boolean, custom?: boolean }> = (props, { attrs, slots }) => {
  const children = slots.default?.({
    ...attrs,
    as: props.as,
    type: props.type,
    disabled: props.disabled,
    active: props.active ?? false,
    isExternal: false
  })

  return children?.length === 1 ? children[0] : children
}
LinkSlot.props = ['as', 'type', 'disabled', 'active', 'custom']
LinkSlot.inheritAttrs = false

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
