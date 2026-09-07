import { z } from 'zod'
import { listAgentPages } from '#agent-discovery'

export default defineMcpTool({
  description: 'Search documentation pages by title, description, or section. With no params, lists all pages.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    search: z.string().optional().describe('Search terms to filter pages by title, path or description. Every term has to match.'),
    section: z.string().optional().describe('Filter by documentation section (e.g., "getting-started", "components", "composables")')
  },
  inputExamples: [
    {},
    { section: 'getting-started' },
    { search: 'installation' },
    { search: 'color', section: 'getting-started' }
  ],
  cache: '30m',
  async handler({ search, section }) {
    // Both URLs come from the same route config the negotiation and the CDN
    // rewrites use, so `markdown_url` cannot drift from where the page really
    // is, and the site URL is no longer written out here.
    const pages = await listAgentPages(useEvent(), {
      search,
      prefix: section ? `/docs/${section}/` : '/docs/'
    })

    return {
      pages: pages
        .map(page => ({
          title: page.title,
          description: page.description,
          path: page.route,
          url: page.url,
          markdown_url: page.rawUrl
        }))
        .sort((a, b) => a.path.localeCompare(b.path)),
      total: pages.length
    }
  }
})
