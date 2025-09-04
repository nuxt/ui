import { z } from 'zod'

const querySchema = z.object({
  framework: z.enum(['vue', 'nuxt']).optional()
})

export default defineCachedEventHandler(async (event) => {
  const rawQuery = getQuery(event)
  const { framework } = querySchema.parse(rawQuery)

  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  const templatesCollectionItems = await queryCollection(event, 'templates')
    .all()

  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  const templateListing = templatesCollectionItems[0].body?.templates || []

  const filteredTemplates = framework
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
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
