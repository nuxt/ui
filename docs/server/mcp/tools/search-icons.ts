import { z } from 'zod'

export default defineMcpTool({
  description: 'Searches one Iconify collection for icons matching a keyword. One collection is searched per call, `lucide` by default, so repeat the call to try another. Returns each match as a `name` in the `i-{prefix}-{name}` format used by Nuxt UI with a `preview` SVG URL, plus the total match count.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true
  },
  inputSchema: {
    query: z.string().describe('Search query (e.g., "arrow", "home", "settings")'),
    collection: z.string().default('lucide').describe('Icon collection to search within (e.g., "lucide", "heroicons", "mdi"). Defaults to "lucide".'),
    limit: z.number().min(1).max(999).optional().describe('Maximum number of results (default: 64)')
  },
  inputExamples: [
    { query: 'home' },
    { query: 'arrow', collection: 'heroicons' },
    { query: 'chart', collection: 'lucide', limit: 10 }
  ],
  cache: '1h',
  async handler({ query, collection, limit }) {
    const params = new URLSearchParams({ query, prefix: collection })
    if (limit) params.set('limit', String(limit))

    const data = await $fetch<{ icons: string[], total: number }>(`https://api.iconify.design/search?${params}`)

    return {
      icons: data.icons.map((icon) => {
        const [iconPrefix, ...nameParts] = icon.split(':')
        const name = nameParts.join(':')
        return {
          name: `i-${iconPrefix}-${name}`,
          preview: `https://api.iconify.design/${iconPrefix}/${name}.svg`
        }
      }),
      total: data.total,
      query,
      collection
    }
  }
})
