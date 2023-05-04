const useComponentsMetaState = () => useState('components-meta', () => ({}))

export async function fetchComponentMeta (name: string) {
  const state = useComponentsMetaState()

  if (state.value[name]?.then) {
    await state.value[name]
    return state.value[name]
  }
  if (state.value[name]) { return state.value[name] }

  // Store promise to avoid multiple calls
  state.value[name] = $fetch(`/api/component-meta/${name}`).then((meta) => {
    state.value[name] = meta
  })

  await state.value[name]
  return state.value[name]
}
