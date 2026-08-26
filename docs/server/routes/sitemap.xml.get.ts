import { queryCollection } from '@nuxt/content/server'

function xmlEscape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const pages = await queryCollection(event, 'docs')
    .select('path')
    .where('extension', '=', 'md')
    .where('path', 'NOT LIKE', '%/.navigation')
    .order('path', 'ASC')
    .all()

  // No `<lastmod>`: this route runs as a serverless function (no git, no source files) so a
  // truthful per-page date is unavailable, and a uniform build date is a signal search engines
  // learn to ignore. Omitting it lets them rely on their own crawl history instead.
  const urls = pages.map(page =>
    `  <url>\n    <loc>${xmlEscape(`${SITE_URL}${page.path}`)}</loc>\n  </url>`
  ).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
