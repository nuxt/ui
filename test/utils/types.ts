import { expectTypeOf } from 'vitest'
import type { VNode } from 'vue'

/**
 * Expect the type of a component emit payload.
 */
export function expectEmitPayloadType<T extends VNode, E extends keyof Events<T>>(_event: E, _cb: () => T) {
  return expectTypeOf<NonNullable<Events<T>[E]>>()
}

/**
 * Expect the type of a slot props.
 */
export function expectSlotProps<T extends VNode, S extends keyof Slots<T>>(_name: S, _cb: () => T) {
  return expectTypeOf<Slots<T>[S]>()
}

type Ctx<V extends VNode> = V extends { __ctx?: infer C } ? NonNullable<C> : never

type Slots<V extends VNode> = Ctx<V> extends { slots: infer S } ? {
  [K in keyof S as S[K] extends never ? never : K]: S[K] extends (props: infer P) => any ? P : never
} : never

type Events<V extends VNode> = Ctx<V> extends { props: infer Props } ? {
  [K in keyof Props as K extends `on${infer E}${infer Rest}` ? `${Lowercase<E>}${Rest}` : never]: NonNullable<Props[K]> extends (...args: infer P) => any ? P : never
} : never
