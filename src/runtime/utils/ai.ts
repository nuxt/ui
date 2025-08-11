import type { UIMessage } from 'ai'

export function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
}
