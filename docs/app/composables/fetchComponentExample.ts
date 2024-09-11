const useComponentExampleState = () => useState<Record<string, any>>('component-example-state', () => ({}))

export async function fetchComponentExample(name: string) {
  const state = useComponentExampleState()

  if (state.value[name]?.then) {
    await state.value[name]
    return state.value[name]
  }
  if (state.value[name]) {
    return state.value[name]
  }

  // Add to nitro prerender
  if (import.meta.server) {
    const event = useRequestEvent()
    event?.node.res.setHeader(
      'x-nitro-prerender',
      [event?.node.res.getHeader('x-nitro-prerender'), `/api/component-example/${name}.json`].filter(Boolean).join(',')
    )
  }

  // Store promise to avoid multiple calls
  state.value[name] = $fetch(`/api/component-example/${name}.json`).then((data) => {
    state.value[name] = data
  }).catch(() => {
    state.value[name] = {}
  })

  await state.value[name]
  return state.value[name]
}
