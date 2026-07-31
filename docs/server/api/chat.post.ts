import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from 'ai'
import type { GatewayProviderOptions } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: 'anthropic/claude-haiku-4.5',
    instructions: 'You are a helpful assistant for Nuxt UI, a UI library for Nuxt and Vue.',
    messages: await convertToModelMessages(messages),
    providerOptions: {
      gateway: {
        caching: 'auto',
        user: getChatUser(event),
        tags: ['docs-chat-example']
      } satisfies GatewayProviderOptions
    }
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
})
