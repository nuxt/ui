import { streamText, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import type { AnthropicLanguageModelOptions } from '@ai-sdk/anthropic'
import { gateway } from '@ai-sdk/gateway'

const webSearchTool = anthropic.tools.webSearch_20250305({
  maxUses: 1
})

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('anthropic/claude-sonnet-4.6'),
    system: 'You are a helpful assistant. When answering questions, search the web for up-to-date information when relevant.',
    messages: await convertToModelMessages(messages),
    tools: {
      web_search: webSearchTool as any
    },
    providerOptions: {
      anthropic: {
        thinking: {
          type: 'adaptive'
        },
        effort: 'low'
      } satisfies AnthropicLanguageModelOptions
    }
  }).toUIMessageStreamResponse()
})
