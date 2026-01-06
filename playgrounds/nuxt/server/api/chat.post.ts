import { streamText, convertToModelMessages } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('google/gemini-2.5-flash'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant for Nuxt UI, a UI library for Nuxt and Vue.',
    messages: await convertToModelMessages(messages),
    providerOptions: {
      openai: {
        reasoningEffort: 'low',
        reasoningSummary: 'detailed'
      },
      google: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: 2048
        }
      }
    }
  }).toUIMessageStreamResponse({
    sendReasoning: true
  })
})
