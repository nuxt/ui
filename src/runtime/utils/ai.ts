import type { FileUIPart, UIMessage } from 'ai'

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
 *
 * Pass the `streaming` slot prop of `UChatMessages` so parts stop streaming when the chat is stopped,
 * the AI SDK leaves their state untouched on abort.
 */
export function isPartStreaming(part: { state?: string }, streaming?: boolean): boolean {
  if (streaming === false) return false

  return part.state === 'streaming'
}

/**
 * Checks if a tool part is still streaming (hasn't reached a terminal state
 * and isn't paused waiting for a user approval).
 *
 * Terminal states are `output-available`, `output-error`, and `output-denied`,
 * `approval-requested` is a paused state, and a denied `approval-responded` won't run.
 *
 * Pass the `streaming` slot prop of `UChatMessages` so tools stop streaming when the chat is stopped.
 */
export function isToolStreaming(part: { state: string, approval?: { approved?: boolean } }, streaming?: boolean): boolean {
  if (streaming === false) return false

  if (part.state === 'approval-responded') {
    return part.approval?.approved !== false
  }

  return !['approval-requested', 'output-available', 'output-error', 'output-denied'].includes(part.state)
}

/**
 * Checks if a tool part is waiting for a user approval response.
 */
export function isToolApprovalPending(part: { state: string }): boolean {
  return part.state === 'approval-requested'
}

/**
 * Converts files, like the ones from `UChatPrompt` `v-model:files`, to file parts for `sendMessage`.
 *
 * The files are inlined as data URLs. Upload them first and pass their URLs instead when they are large.
 */
export function toFileUIParts(files: File[]): Promise<FileUIPart[]> {
  return Promise.all(files.map(file => new Promise<FileUIPart>((resolve, reject) => {
    const reader = new FileReader()
    // A browser leaves `type` empty when it can't tell the media type
    reader.onload = () => resolve({ type: 'file', mediaType: file.type || 'application/octet-stream', filename: file.name, url: reader.result as string })
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })))
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
