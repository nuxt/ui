import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import type { DocsChatMessage } from '~~/server/api/ai.post'

export const useChat = createSharedComposable(() => {
  const storageOpen = useLocalStorage('chat-open', false)
  const messages = useLocalStorage<DocsChatMessage[]>('chat-messages', [])

  const open = ref(false)

  onNuxtReady(() => {
    nextTick(() => {
      open.value = storageOpen.value
    })
  })

  watch(open, (value) => {
    storageOpen.value = value
  })

  // Set by the flows that hand the panel a question before it exists (the
  // search palette, "Explain with AI"): the panel mounts on its first open,
  // so its own sync watcher is not there to send it. The panel clears it.
  const pending = ref(false)

  function ask(text: string) {
    messages.value = [...messages.value, {
      id: String(Date.now()),
      role: 'user',
      parts: [{ type: 'text', text }]
    }]
    pending.value = true
    open.value = true
  }

  return {
    open,
    messages,
    pending,
    ask
  }
})
