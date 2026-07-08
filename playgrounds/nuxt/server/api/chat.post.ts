import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse, tool } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import type { AnthropicLanguageModelOptions } from '@ai-sdk/anthropic'
import { gateway } from '@ai-sdk/gateway'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-5'),
    instructions: 'You are a helpful assistant. When answering questions, search the web for up-to-date information when relevant. Use the `send_email` tool when the user asks to send an email.',
    messages: await convertToModelMessages(messages),
    tools: {
      web_search: anthropic.tools.webSearch_20250305(),
      send_email: tool({
        description: 'Send an email to a recipient.',
        inputSchema: z.object({
          to: z.string().describe('The recipient email address'),
          subject: z.string().describe('The email subject'),
          body: z.string().describe('The email body')
        }),
        execute: async ({ to }) => ({ sent: true, to })
      })
    },
    toolApproval: {
      send_email: 'user-approval'
    },
    providerOptions: {
      anthropic: {
        thinking: {
          type: 'adaptive'
        },
        effort: 'low'
      } satisfies AnthropicLanguageModelOptions
    }
  })

  const stream = toUIMessageStream({ stream: result.stream })
  return createUIMessageStreamResponse({ stream })
})
