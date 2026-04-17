import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Search composables by name or description',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    search: z.string().optional().describe('Search term to filter composables by name or description')
  },
  inputExamples: [
    {},
    { search: 'toast' },
    { search: 'overlay' }
  ],
  cache: '1h',
  async handler({ search }) {
    const event = useEvent()

    const composables = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '/docs/composables/%')
      .where('extension', '=', 'md')
      .select('path', 'title', 'description')
      .all()

    let results = composables.map(composable => ({
      name: composable.path.split('/').pop(),
      title: composable.title,
      description: composable.description,
      path: composable.path,
      url: `https://ui.nuxt.com${composable.path}`
    }))

    if (search) {
      const searchLower = search.toLowerCase()
      results = results.filter(composable =>
        composable.name?.toLowerCase().includes(searchLower)
        || composable.title?.toLowerCase().includes(searchLower)
        || composable.description?.toLowerCase().includes(searchLower)
      )
    }

    return {
      composables: results.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
      total: results.length
    }
  }
})
