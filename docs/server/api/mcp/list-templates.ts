import { z } from 'zod'

const querySchema = z.object({
  framework: z.enum(['vue', 'nuxt']).optional()
})

export default defineCachedEventHandler(async (event) => {
  const rawQuery = getQuery(event)
  const { framework } = querySchema.parse(rawQuery)

  const templatesCollectionItems = await queryCollection(event, 'templates')
    .all()

  const templateListing = templatesCollectionItems[0].body?.templates || []

  const filteredTemplates = framework
    ? templateListing.filter(template => template.framework === framework)
    : templateListing

  return {
    templates: filteredTemplates,
    total: filteredTemplates.length
  }
}, {
  name: 'mcp-list-templates',
  maxAge: 0 // 1 hour
})
