import type { ComponentMeta } from 'vue-component-meta'

const useComponentsMetaState = () => useState<Record<string, any>>('component-meta-state', () => ({}))

export async function fetchComponentMeta(name: string): Promise<{ meta: ComponentMeta }> {
  const state = useComponentsMetaState()

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
      [event?.node.res.getHeader('x-nitro-prerender'), `/api/component-meta/${name}.json`].filter(Boolean).join(',')
    )
  }

  // Store promise to avoid multiple calls
  state.value[name] = $fetch(`/api/component-meta/${name}.json`).then((meta) => {
    state.value[name] = meta
  }).catch(() => {
    state.value[name] = {}
  })

  await state.value[name]
  return state.value[name]
}
