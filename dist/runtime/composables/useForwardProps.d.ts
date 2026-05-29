import type { ComputedRef, MaybeRef } from 'vue';
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
export declare function useForwardProps<T extends object, E extends string = string>(source: MaybeRef<T> | ComputedRef<T>, emits?: (event: E, ...args: any[]) => void): ComputedRef<Partial<T>>;
