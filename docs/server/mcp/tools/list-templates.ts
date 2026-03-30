import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Lists all available Nuxt UI templates with optional framework filtering',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    framework: z.string().optional().describe('Filter templates by framework (e.g., "Nuxt", "Vue")')
  },
  inputExamples: [
    { framework: 'Nuxt' },
    {}
  ],
  cache: '1h',
  async handler({ framework }) {
    const event = useEvent()

    const templatesCollectionItems = await queryCollection(event, 'templates').first()

    const templateListing = templatesCollectionItems?.items || []

    const filteredTemplates = framework
      ? templateListing.filter((template: Record<string, any>) => template.framework === framework)
      : templateListing

    return {
      templates: filteredTemplates,
      total: filteredTemplates.length
    }
  }
})
