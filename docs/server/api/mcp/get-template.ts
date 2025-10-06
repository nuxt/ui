import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

const querySchema = z.object({
  templateName: z.string().min(1, 'Missing templateName')
})

export default defineCachedEventHandler(async (event) => {
  const { templateName } = await getValidatedQuery(event, querySchema.parse)

  const template = await queryCollection(event, 'templates')
    .where('title', '=', templateName)
    .first()

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
