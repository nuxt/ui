import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Search components by name, category, or intent. Matches alternate names from other ecosystems (e.g. "segmented control" finds FieldGroup, "combobox" finds InputMenu, "dialog" finds Modal). Results are ranked by relevance',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    category: z.string().optional().describe('Filter components by category'),
    search: z.string().optional().describe('Search term to filter components by name, description, or intent (alternate names like "segmented control" are matched)')
  },
  inputExamples: [
    { category: 'layout' },
    { search: 'table' },
    { search: 'segmented control' },
    { category: 'forms', search: 'input' }
  ],
  cache: '30m',
  async handler({ category, search }) {
    const event = useEvent()

    let query = queryCollection(event, 'docs')
      .where('path', 'LIKE', '/docs/components/%')
      .where('extension', '=', 'md')
      .where('index', 'IS NULL')
      .select('id', 'title', 'description', 'path', 'category', 'keywords', 'links')

    if (category) {
      query = query.where('category', '=', category)
    }

    const components = await query.all()

    let results = components.map(component => ({
      name: component.path.split('/').pop(),
      title: component.title,
      description: component.description,
      category: component.category,
      keywords: component.keywords ?? undefined,
      path: component.path,
      url: `https://ui.nuxt.com${component.path}`,
      links: component.links
    }))

    if (search?.trim()) {
      results = results
        .map(component => ({ component, score: scoreComponent(component, search) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || (a.component.name || '').localeCompare(b.component.name || ''))
        .map(({ component }) => component)
    } else {
      results.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }

    return {
      components: results,
      total: results.length,
      filters: { category, search }
    }
  }
})
