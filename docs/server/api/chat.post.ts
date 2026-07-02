import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: gateway('anthropic/claude-haiku-4.5'),
    instructions: 'You are a helpful assistant for Nuxt UI, a UI library for Nuxt and Vue.',
    messages: await convertToModelMessages(messages)
  })

  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })
})
