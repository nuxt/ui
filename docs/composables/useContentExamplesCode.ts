const useContentExamplesCodeState = () => useState('content-examples-code', () => ({}))

export async function fetchContentExampleCode(name?: string) {
  if (!name) return
  const state = useContentExamplesCodeState()

  if (state.value[name]?.then) {
    await state.value[name]
    return state.value[name]
  }
  if (state.value[name]) {
    return state.value[name]
  }

  // add to nitro prerender
  if (import.meta.server) {
    const event = useRequestEvent()
    event.node.res.setHeader(
      'x-nitro-prerender',
      [event.node.res.getHeader('x-nitro-prerender'), `/api/content-examples-code/${name}.json`].filter(Boolean).join(',')
    )
  }
  state.value[name] = $fetch(`/api/content-examples-code/${name}.json`).then((data) => {
    state.value[name] = data
  })

  await state.value[name]
  return state.value[name]
}
