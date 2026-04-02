import type { UIMessage } from 'ai'

/**
 * Extracts and concatenates all text parts from a UIMessage.
 *
 * @warning Do not use the output directly with MDC or v-html for user messages,
 * as this can lead to XSS vulnerabilities. For rendering, iterate over message.parts
 * and only render assistant messages with MDC.
 */
export function getTextFromMessage(message: UIMessage) {
  return message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('')
}

/**
 * Checks if a text or reasoning part is currently being streamed.
 */
export function isPartStreaming(part: { state?: string }): boolean {
  return part.state === 'streaming'
}

/**
 * Checks if a tool part is still streaming (hasn't reached a terminal state).
 *
 * Terminal states are `output-available`, `output-error`, and `output-denied`.
 */
export function isToolStreaming(part: { state: string }): boolean {
  return !['output-available', 'output-error', 'output-denied'].includes(part.state)
}

/**
 * Checks if a reasoning part is currently being streamed.
 *
 * @deprecated Use `isPartStreaming` instead.
 */
export function isReasoningStreaming(
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
