import { z } from 'zod'

const querySchema = z.object({
  templateName: z.string().min(1, 'Missing templateName')
})

export default defineCachedEventHandler(async (event) => {
  const { templateName } = await getValidatedQuery(event, querySchema.parse)

  const { templates } = await $fetch('/api/mcp/list-templates')
  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
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
