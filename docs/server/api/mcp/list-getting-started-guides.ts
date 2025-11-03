import { queryCollection } from '@nuxt/content/server'

export default defineCachedEventHandler(async (event) => {
  const pages = await queryCollection(event, 'docs')
    .where('path', 'LIKE', '/docs/getting-started/%')
    .where('extension', '=', 'md')
    .select('id', 'title', 'description', 'path', 'navigation')
    .all()

  return pages.map(page => ({
    title: page.title,
    description: page.description,
    path: page.path,
    url: `https://ui.nuxt.com${page.path}`,
    navigation: page.navigation
  })).sort((a, b) => a.path.localeCompare(b.path))
}, {
  name: 'mcp-list-getting-started-guides',
  maxAge: 1800 // 30 minutes
})
