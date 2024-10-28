import { expectTypeOf } from 'vitest'
import type { VNode } from 'vue'

/**
 * Expect the type of a component emit payload.
 */
export function expectEmitPayloadType<T extends VNode, E extends keyof Events<T>>(_event: E, _cb: () => T) {
  return expectTypeOf<NonNullable<Events<T>[E]>>()
}

type Events<T> = T extends { __ctx?: { props: infer Props } } ? {
  [K in keyof Props as K extends `on${infer E}${infer Rest}` ? `${Lowercase<E>}${Rest}` : never]: NonNullable<Props[K]> extends (...args: infer P) => any ? P : never
} : never
