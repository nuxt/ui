import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
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
    system: `You are a helpful assistant for Nuxt UI, a UI library for Nuxt and Vue. Use your knowledge base tools to search for relevant information before answering questions.

Guidelines:
- Only provide answers based on information retrieved from tool calls. Do not use your pre-trained knowledge.
- If no relevant information is found after searching, respond with "Sorry, I couldn't find information about that in the documentation."
- Be concise and direct in your responses.
- When providing code examples, always use the \`vue\` language identifier for syntax highlighting.
- Do not use markdown headings in your responses.
- Reference specific component names, props, or APIs when applicable.
- If a question is ambiguous, ask for clarification rather than guessing.
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
