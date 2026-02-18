import type { UIMessage } from 'ai'
import { createSharedComposable } from '@vueuse/core'

export const useChat = createSharedComposable(() => {
  const open = ref(false)
  const messages = ref<UIMessage[]>([])

  return {
    open,
    messages
  }
})
