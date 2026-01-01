import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { experimental_createMCPClient } from '@ai-sdk/mcp'
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
    model: gateway('anthropic/claude-sonnet-4.5'),
    maxOutputTokens: 10000,
    system: `You are a helpful assistant for Nuxt UI, a UI library for Nuxt and Vue. Use your knowledge base tools to search for relevant information before answering questions.

Guidelines:
- ALWAYS use tools to search for information. Never rely on pre-trained knowledge.
- If no relevant information is found after searching, respond with "Sorry, I couldn't find information about that in the documentation."
- Be concise and direct in your responses.

**FORMATTING RULES (CRITICAL):**
- ABSOLUTELY NO MARKDOWN HEADINGS: Never use #, ##, ###, ####, #####, or ######
- NO underline-style headings with === or ---
- Use **bold text** for emphasis and section labels instead
- Examples:
  * Instead of "## Usage", write "**Usage:**" or just "Here's how to use it:"
  * Instead of "# Complete Guide", write "**Complete Guide**" or start directly with content
- Start all responses with content, never with a heading

- Reference specific component names, props, or APIs when applicable.
- If a question is ambiguous, ask for clarification rather than guessing.
- When multiple relevant items are found, list them clearly using bullet points.
- You have up to 6 tool calls to find the answer, so be strategic: start broad, then get specific if needed.
- Format responses in a conversational way, not as documentation sections.
    `,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(6),
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
