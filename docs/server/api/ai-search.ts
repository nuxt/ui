import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp'
import { streamText, convertToModelMessages, experimental_createMCPClient, stepCountIs } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const httpTransport = new StreamableHTTPClientTransport(
    new URL(import.meta.dev ? 'http://localhost:3000/mcp' : 'https://ui.nuxt.com/mcp')
  )
  const httpClient = await experimental_createMCPClient({
    transport: httpTransport
  })
  const tools = await httpClient.tools()

  return streamText({
    model: gateway('openai/gpt-4o-mini'),
    maxOutputTokens: 10000,
    system: `You are a helpful assistant for Nuxt UI. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
    Format your markdown response using the following rules:
    - Use the vue lang for code blocks syntax highlighting.
    - Don't use markdown headings.
    `,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(2),
    tools,
    onFinish: async () => {
      await httpClient.close()
    },
    onError: async (error) => {
      console.error(error)

      await httpClient.close()
    }
  }).toUIMessageStreamResponse()
})
