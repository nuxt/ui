import { queryCollection } from '@nuxt/content/server'

const DOMAIN = 'https://ui.nuxt.com'

export default defineEventHandler(async (event) => {
  const pages = await queryCollection(event, 'docs')
    .select('path', 'title')
    .where('extension', '=', 'md')
    .where('path', 'NOT LIKE', '%/.navigation')
    .order('path', 'ASC')
    .all()

  const sections: Record<string, { title: string, path: string }[]> = {}

  for (const page of pages) {
    const parts = page.path.replace(/^\/docs\//, '').split('/')
    const sectionKey = parts[0] || 'docs'
    if (!sections[sectionKey]) {
      sections[sectionKey] = []
    }
    sections[sectionKey].push({ title: page.title, path: page.path })
  }

  const sectionLabels: Record<string, string> = {
    'getting-started': 'Getting Started',
    'components': 'Components',
    'composables': 'Composables',
    'typography': 'Typography'
  }

  let md = '# Nuxt UI Sitemap\n\n'
  md += '> Markdown index of every page on ui.nuxt.com. Append `.md` to any docs URL (or set `Accept: text/markdown`) to retrieve the markdown source.\n\n'

  for (const [key, pages] of Object.entries(sections)) {
    const label = sectionLabels[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ')
    md += `## ${label}\n\n`
    for (const page of pages) {
      const pageLabel = (page.title || page.path)
        .replace(/\\/g, '\\\\')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
      md += `- [${pageLabel}](${DOMAIN}${page.path}.md)\n`
    }
    md += '\n'
  }

  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return md
})
