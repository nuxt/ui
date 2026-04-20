import type { ComponentMeta } from 'vue-component-meta'

export function useFetchComponentMeta(name: string) {
  if (import.meta.server) {
    const event = useRequestEvent()
    event?.node.res.setHeader(
      'x-nitro-prerender',
      [event?.node.res.getHeader('x-nitro-prerender'), `/api/component-meta/${name}.json`].filter(Boolean).join(',')
    )
  }

  return useAsyncData<{ meta: ComponentMeta }>(`component-meta-${name}`, () => $fetch(`/api/component-meta/${name}.json`).catch(() => ({}) as any), {
    lazy: import.meta.client,
    dedupe: 'defer',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
  })
}
