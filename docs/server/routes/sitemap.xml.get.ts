import { queryCollection } from '@nuxt/content/server'

function xmlEscape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

const DOMAIN = 'https://ui.nuxt.com'

export default defineEventHandler(async (event) => {
  const pages = await queryCollection(event, 'docs')
    .select('path')
    .where('extension', '=', 'md')
    .where('path', 'NOT LIKE', '%/.navigation')
    .order('path', 'ASC')
    .all()

  const today = new Date().toISOString().split('T')[0]
  const urls = pages.map(page =>
    `  <url>\n    <loc>${xmlEscape(`${DOMAIN}${page.path}`)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
