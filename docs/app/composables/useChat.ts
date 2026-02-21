import type { UIMessage } from 'ai'
import { createSharedComposable } from '@vueuse/core'

export const useChat = createSharedComposable(() => {
  const open = useCookie('chat-open', { default: () => false })
  const messages = ref<UIMessage[]>([])

  return {
    open,
    messages
  }
})
