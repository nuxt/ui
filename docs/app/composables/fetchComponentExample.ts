export function useFetchComponentExample(name: string) {
  if (import.meta.server) {
    const event = useRequestEvent()
    event?.node.res.setHeader(
      'x-nitro-prerender',
      [event?.node.res.getHeader('x-nitro-prerender'), `/api/component-example/${name}.json`].filter(Boolean).join(',')
    )
  }

  return useAsyncData(`component-example-${name}`, () => $fetch(`/api/component-example/${name}.json`).catch(() => ({})), {
    lazy: import.meta.client,
    dedupe: 'defer',
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
  })
}
