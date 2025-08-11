// import { streamText } from 'ai'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return messages
  // return streamText({
  //   model: workersAI('@cf/meta/llama-3.2-3b-instruct'),
  //   maxTokens: 10000,
  //   system: 'You are a helpful assistant that can answer questions and help.',
  //   messages
  // }).toDataStreamResponse()
})
