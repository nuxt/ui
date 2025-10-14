import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

const querySchema = z.object({
  framework: z.enum(['vue', 'nuxt']).optional()
})

export default defineCachedEventHandler(async (event) => {
  const { framework } = await getValidatedQuery(event, querySchema.parse)

  const templatesCollectionItems = await queryCollection(event, 'templates').first()

  const templateListing = templatesCollectionItems?.items || []

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
