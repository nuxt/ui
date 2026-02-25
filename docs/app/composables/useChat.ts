import type { UIMessage } from 'ai'
import { createSharedComposable, useLocalStorage } from '@vueuse/core'

export const useChat = createSharedComposable(() => {
  const open = useCookie('chat-open', { default: () => false })
  const messages = useLocalStorage<UIMessage[]>('chat-messages', [])

  return {
    open,
    messages
  }
})
