import { getCurrentInstance, onBeforeUpdate, shallowRef, toRaw } from 'vue'
import type { ComponentInternalInstance, ShallowRef, VNode } from 'vue'

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

const versions = new WeakMap<ComponentInternalInstance, ShallowRef<number>>()

function passedKeys(vnode: VNode): string {
  let keys = ''
  for (const key in vnode.props) {
    if (vnode.props[key] !== undefined) {
      keys += key + ','
    }
  }
  return keys
}

/**
 * Whether the parent passed a prop to a component, to read inside a computed.
 * A vnode's props aren't reactive, and a prop passed with its `withDefaults`
 * value, or no longer passed, leaves the component's own props unchanged, so
 * the set of passed props is tracked through a version, bumped before the
 * update that follows a change of it.
 * @internal
 */
export function usePassedProps(vm: ComponentInternalInstance): (prop: string) => boolean {
  let version = versions.get(vm)
  if (!version) {
    const ref = version = shallowRef(0)
    versions.set(vm, ref)
    let keys = passedKeys(vm.vnode)
    onBeforeUpdate(() => {
      const next = passedKeys(vm.vnode)
      if (next !== keys) {
        keys = next
        ref.value++
      }
    }, vm)
  }
  const tracked = version
  return (prop) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    tracked.value
    return propIsDefined(vm.vnode, prop)
  }
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
  if (vm && props && toRaw(props) === toRaw(vm.props)) {
    return usePassedProps(vm)
  }
  return prop => (props as Record<string, unknown> | undefined)?.[prop] !== undefined
}
