import { z } from 'zod'

const querySchema = z.object({
  templateName: z.string().min(1, 'Missing templateName')
})

export default defineCachedEventHandler(async (event) => {
  const rawQuery = getQuery(event)
  const { templateName } = querySchema.parse(rawQuery)

  const { templates } = await $fetch('/api/mcp/list-templates')
  const template = templates.find((t: any) => t.title.toLowerCase() === templateName.toLowerCase())

  if (!template) {
    throw createError({
      statusCode: 404,
      statusMessage: `Template "${templateName}" not found. Use the list_templates tool to see all available templates.`
    })
  }

  return template
}, {
  name: 'mcp-get-template',
  maxAge: 1800 // 30 minutes
})
