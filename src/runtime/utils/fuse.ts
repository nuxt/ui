import type { MaybeRefOrGetter } from 'vue'
import type { FuseResult } from 'fuse.js'
import type { UseFuseOptions } from '@vueuse/integrations/useFuse'
import { computed, onMounted, shallowRef, toValue, watch } from 'vue'

type Fuse = typeof import('fuse.js').default

let loaded: Fuse | undefined
let loading: Promise<Fuse> | undefined

export function loadFuse(): Promise<Fuse> {
  loading ||= import('fuse.js').then(module => loaded = module.default)

  return loading
}

/**
 * The results of `useFuse` from `@vueuse/integrations`, with `fuse.js` loaded on demand instead of with the component.
 * It loads in the browser once there are items to filter, so a component whose items are all filtered elsewhere never
 * loads it. Until it has loaded, a search returns every item, like an empty one with `matchAllWhenSearchEmpty`.
 *
 * The server never filters with it. In the browser, a component created once it has loaded filters from its first
 * render, which can't happen while the page hydrates since nothing has loaded it yet, so both render the same items.
 */
export function useLazyFuse<T>(search: MaybeRefOrGetter<string | undefined>, data: MaybeRefOrGetter<T[]>, options: MaybeRefOrGetter<UseFuseOptions<T>>) {
  const Fuse = shallowRef<Fuse | undefined>(import.meta.client ? loaded : undefined)
  const mounted = shallowRef(false)

  onMounted(() => {
    mounted.value = true
  })

  watch(() => mounted.value && !Fuse.value && toValue(data).length > 0, (needed) => {
    if (!needed) return

    loadFuse().then((value) => {
      Fuse.value = value
    }).catch(() => {})
  }, { immediate: true })

  const fuse = computed(() => Fuse.value ? new Fuse.value(toValue(data), toValue(options).fuseOptions) : undefined)

  const results = computed<FuseResult<T>[]>(() => {
    const { matchAllWhenSearchEmpty, resultLimit } = toValue(options)
    const term = toValue(search)

    if (matchAllWhenSearchEmpty && (!term || !fuse.value)) {
      return toValue(data).map((item, refIndex) => ({ item, refIndex }))
    }

    return fuse.value?.search(term ?? '', resultLimit ? { limit: resultLimit } : undefined) ?? []
  })

  return { results }
}
