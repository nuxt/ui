import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Lists all getting started guides and installation instructions',
  cache: '30m',
  async handler() {
    const event = useEvent()

    const pages = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '/docs/getting-started/%')
      .where('extension', '=', 'md')
      .select('id', 'title', 'description', 'path', 'navigation')
      .all()

    const result = pages.map(page => ({
      title: page.title,
      description: page.description,
      path: page.path,
      url: `https://ui.nuxt.com${page.path}`,
      navigation: page.navigation
    })).sort((a, b) => a.path.localeCompare(b.path))

    return jsonResult(result)
  }
})
