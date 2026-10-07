import { onBeforeUnmount, onMounted, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { requestIdleCallback, cancelIdleCallback } from '../utils/prefetch'

export function usePreloadOnIdle(preload: () => Promise<unknown>) {
  let idleId: ReturnType<typeof requestIdleCallback>

  onMounted(() => {
    idleId = requestIdleCallback(() => {
      preload().catch(() => {})
    })
  })

  onBeforeUnmount(() => {
    cancelIdleCallback(idleId)
  })
}

/**
 * `false` until `open` is first truthy, then `true` for good. Preloads the overlay once idle after mount.
 */
export function useLazyOverlay(open: MaybeRefOrGetter<boolean | undefined>, preload: () => Promise<unknown>) {
  const rendered = ref(!!toValue(open))

  watch(() => toValue(open), (value) => {
    if (value) {
      rendered.value = true
    }
  })

  usePreloadOnIdle(preload)

  return rendered
}
