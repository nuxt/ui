import type { ComputedRef, MaybeRef } from 'vue'
import { computed, isRef } from 'vue'
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
 */
export function useForwardProps<T extends object, E extends string = string>(
  source: MaybeRef<T> | ComputedRef<T>,
  emits?: (event: E, ...args: any[]) => void
): ComputedRef<Partial<T>> {
  const emitAsProps = emits ? useEmitAsProps(emits) : {}
  return computed(() => {
    const src = isRef(source) ? source.value : source
    const out: Record<string, any> = { ...emitAsProps }
    for (const key in src) {
      const value = (src as any)[key]
      if (value !== undefined) out[key] = value
    }
    return out as Partial<T>
  })
}
