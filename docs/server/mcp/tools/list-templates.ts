import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Lists all available Nuxt UI templates with optional category filtering',
  inputSchema: {
    category: z.string().optional().describe('Filter templates by category')
  },
  cache: '1h',
  async handler({ category }) {
    const event = useEvent()

    const templatesCollectionItems = await queryCollection(event, 'templates').first()

    const templateListing = templatesCollectionItems?.items || []

    const filteredTemplates = category
      ? templateListing.filter((template: any) => template.framework === category)
      : templateListing

    return jsonResult({
      templates: filteredTemplates,
      total: filteredTemplates.length
    })
  }
})
