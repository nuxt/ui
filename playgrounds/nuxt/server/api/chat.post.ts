import { streamText, convertToModelMessages } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('openai/gpt-4o-mini'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant for Nuxt UI, a UI library for Nuxt and Vue.',
    messages: await convertToModelMessages(messages)
  }).toUIMessageStreamResponse()
})
