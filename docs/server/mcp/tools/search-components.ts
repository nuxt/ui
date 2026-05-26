import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Search components by name, description, or category',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    category: z.string().optional().describe('Filter components by category'),
    search: z.string().optional().describe('Search term to filter components by name or description')
  },
  inputExamples: [
    { category: 'layout' },
    { search: 'table' },
    { category: 'forms', search: 'input' }
  ],
  cache: '30m',
  async handler({ category, search }) {
    const event = useEvent()

    let query = queryCollection(event, 'docs')
      .where('path', 'LIKE', '/docs/components/%')
      .where('extension', '=', 'md')
      .where('index', 'IS NULL')
      .select('id', 'title', 'description', 'path', 'category', 'links')

    if (category) {
      query = query.where('category', '=', category)
    }

    const components = await query.all()

    let results = components.map(component => ({
      name: component.path.split('/').pop(),
      title: component.title,
      description: component.description,
      category: component.category,
      path: component.path,
      url: `https://ui.nuxt.com${component.path}`,
      links: component.links
    }))

    if (search) {
      const searchLower = search.toLowerCase()
      results = results.filter(component =>
        component.name?.toLowerCase().includes(searchLower)
        || component.title?.toLowerCase().includes(searchLower)
        || component.description?.toLowerCase().includes(searchLower)
      )
    }

    return {
      components: results.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
      total: results.length,
      filters: { category, search }
    }
  }
})
