import { z } from 'zod'

const querySchema = z.object({
  category: z.string().optional().describe('Filter components by category'),
  search: z.string().optional().describe('Search term to filter components by name or description')
})

export default defineCachedEventHandler(async (event) => {
  const { category, search } = await getValidatedQuery(event, querySchema.parse)

  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  let query = queryCollection(event, 'docs')
    .where('path', 'LIKE', '/docs/components/%')
    .where('extension', '=', 'md')
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    .select('id', 'title', 'description', 'path', 'category', 'links')

  if (category) {
    query = query.where('category', '=', category)
  }

  const components = await query.all()

  let results = components.map(component => ({
    name: component.path.split('/').pop(),
    title: component.title,
    description: component.description,
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    category: component.category,
    path: component.path,
    url: `https://ui4.nuxt.com${component.path}`,
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    links: component.links
  }))

  // Apply search filter if provided
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
}, {
  name: 'mcp-search-components-by-category',
  maxAge: 1800 // 30 minutes
})
