import type { UIMessage } from 'ai'
import { createSharedComposable, useLocalStorage } from '@vueuse/core'

export const useChat = createSharedComposable(() => {
  const storageOpen = useLocalStorage('chat-open', false)
  const messages = useLocalStorage<UIMessage[]>('chat-messages', [])

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
