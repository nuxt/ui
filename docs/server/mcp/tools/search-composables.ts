import { z } from 'zod'
import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Finds Nuxt UI composables such as `useToast` or `useOverlay`. `search` is a case-insensitive substring match on the name, title and description, checked against the whole string, so pass one keyword rather than a sentence. With no `search` it lists every composable. Returns name, title, description, path and URL for each match, sorted by name. It does not return usage or signatures. Read a result with `get-documentation-page` using its `path`.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    search: z.string().optional().describe('Single keyword, matched as a substring of the name, title or description')
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
      url: `${SITE_URL}${composable.path}`
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
