import type { UIMessage } from 'ai'

export const useChat = function () {
  const open = useCookie('chat-open', { default: () => false })
  const messages = useCookie<UIMessage[]>('chat-messages', { default: () => [] })

  return {
    open,
    messages
  }
}
