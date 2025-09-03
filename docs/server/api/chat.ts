export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return messages
})
