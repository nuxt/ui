import type { UIMessage } from 'ai'

/**
 * Extracts and concatenates all text parts from a UIMessage.
 *
 * @warning Do not use the output directly with MDC or v-html for user messages,
 * as this can lead to XSS vulnerabilities. For rendering, iterate over message.parts
 * and only render assistant messages with MDC.
 *
 * @deprecated Iterate over `message.parts` with `isTextUIPart` from `ai` instead.
 */
export function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
}

/**
 * Checks if a specific message part is currently being streamed.
 *
 * Returns `true` when the chat is streaming, the message is the last one,
 * and no parts of a different type follow the given part index.
 */
export function isStreamingPart(
  message: UIMessage,
  partIndex: number,
  chat: { status: string, messages: UIMessage[] }
): boolean {
  if (chat.status !== 'streaming') return false
  if (message.id !== chat.messages.at(-1)?.id) return false
  if (partIndex < 0 || partIndex >= message.parts.length) return false

  const partType = message.parts[partIndex]!.type
  for (let i = partIndex + 1; i < message.parts.length; i++) {
    if (message.parts[i]!.type !== partType) return false
  }
  return true
}
