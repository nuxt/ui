import type { ComputedRef, MaybeRef } from 'vue'
import { computed, unref } from 'vue'
import { useEmitAsProps } from 'reka-ui'

/**
 * Proxy-aware replacement for reka-ui's `useForwardProps` / `useForwardPropsEmits`.
 * Forwards every enumerable key of `source` whose value is not `undefined`, and
 * — when `emits` is provided — merges the emit handlers as `onUpdate:open`-style
 * props on the resulting object.
 *
 * Unlike reka-ui's version, this does NOT filter by `vm.vnode.props` or
 * `vm.type.props.<key>.default`, so values supplied by `<UTheme :props>`
 * through `useComponentProps` flow through transparently to the underlying
 * Reka primitive.
 *
 * When `keys` is provided, only those keys of `source` are forwarded.
 */
export function useForwardProps<T extends object, K extends keyof T, E extends string = string>(
  source: T,
  keys: readonly K[],
  emits?: (event: E, ...args: any[]) => void
): ComputedRef<Partial<Pick<T, K>>>
export function useForwardProps<T extends object, E extends string = string>(
  source: MaybeRef<T> | ComputedRef<T>,
  emits?: (event: E, ...args: any[]) => void
): ComputedRef<Partial<T>>
export function useForwardProps(
  source: MaybeRef<object> | ComputedRef<object>,
  keysOrEmits?: readonly PropertyKey[] | ((event: string, ...args: any[]) => void),
  emits?: (event: string, ...args: any[]) => void
): ComputedRef<Record<PropertyKey, any>> {
  const keys = Array.isArray(keysOrEmits) ? keysOrEmits : undefined
  const emit = keys ? emits : keysOrEmits as typeof emits
  // reka-ui 2.10.0 tightened `useEmitAsProps` to require an `Emit<Name, Fn>` inferred
  // from a concrete `defineEmits` signature; our generic proxy emit doesn't satisfy it,
  // so cast at the call site (this is a runtime-transparent name → `onXxx` prop mapping).
  const emitAsProps = emit ? useEmitAsProps(emit as Parameters<typeof useEmitAsProps>[0]) : {}
  return computed(() => {
    const src = unref(source) as Record<PropertyKey, any>
    const out: Record<PropertyKey, any> = { ...emitAsProps }
    if (keys) {
      for (const key of keys) {
        const value = src[key]
        if (value !== undefined) out[key] = value
      }
    } else {
      for (const key in src) {
        const value = src[key]
        if (value !== undefined) out[key] = value
      }
    }
    return out
  })
}
