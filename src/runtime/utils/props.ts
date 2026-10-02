import { getCurrentInstance, toRaw } from 'vue'
import type { VNode } from 'vue'

function camelCase(str: string): string {
  return str.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
}

function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)
}

/**
 * Vuetify-style detection for whether a prop was explicitly passed by the parent,
 * distinguishing "user set it" from "got the `withDefaults` fallback".
 * Checks both camelCase and kebab-case names to cover both template conventions.
 */
export function propIsDefined(vnode: VNode | null | undefined, prop: string): boolean {
  if (!vnode || !vnode.props) return false
  return vnode.props[camelCase(prop)] !== undefined
    || vnode.props[kebabCase(prop)] !== undefined
}

/**
 * Whether a prop of `props` was set, for a composable that reads a component's
 * raw props. For the current component's own props that is whether the parent
 * passed it, as opposed to the prop holding its `withDefaults` value; for any
 * other object, whether it holds a value. Call it in `setup`: it returns a
 * function to read inside a computed.
 * @internal
 */
export function usePropIsSet(props: object | undefined): (prop: string) => boolean {
  const vm = getCurrentInstance()
  const own = !!vm && !!props && toRaw(props) === toRaw(vm.props)
  return prop => own ? propIsDefined(vm!.vnode, prop) : (props as Record<string, unknown> | undefined)?.[prop] !== undefined
}
