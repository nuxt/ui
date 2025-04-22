import { streamText } from 'ai'
import { createWorkersAI } from 'workers-ai-provider'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  // Enable AI Gateway if defined in environment variables
  const gateway = process.env.CLOUDFLARE_AI_GATEWAY_ID
    ? {
        id: process.env.CLOUDFLARE_AI_GATEWAY_ID,
        cacheTtl: 60 * 60 * 24 // 24 hours
      }
    : undefined
  const workersAI = createWorkersAI({ binding: hubAI(), gateway })

  return streamText({
    model: workersAI('@cf/meta/llama-3.2-3b-instruct'),
    maxTokens: 10000,
    system: 'You are a helpful assistant that can answer questions and help.',
    messages
  }).toDataStreamResponse()
})
