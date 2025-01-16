const useComponentsMetaState = () => useState('components-meta', () => ({}))

export async function fetchComponentMeta(name: string) {
  const state = useComponentsMetaState()

  if (state.value[name]?.then) {
    await state.value[name]
    return state.value[name]
  }
  if (state.value[name]) {
    return state.value[name]
  }

  // Store promise to avoid multiple calls

  // add to nitro prerender
  if (import.meta.server) {
    const event = useRequestEvent()
    event.node.res.setHeader(
      'x-nitro-prerender',
      [event.node.res.getHeader('x-nitro-prerender'), `/api/component-meta/${name}.json`].filter(Boolean).join(',')
    )
  }
  state.value[name] = $fetch(`/api/component-meta/${name}.json`).then((meta) => {
    state.value[name] = meta
  })

  await state.value[name]
  return state.value[name]
}
