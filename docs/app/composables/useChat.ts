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

  return {
    open,
    messages
  }
})
