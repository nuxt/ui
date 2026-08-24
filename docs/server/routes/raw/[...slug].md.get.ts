import { withLeadingSlash } from 'ufo'
import { stringify } from 'minimark/stringify'
import { queryCollection } from '@nuxt/content/server'
import type { Collections, PageCollectionItemBase } from '@nuxt/content'
import collections from '#content/manifest'
import { transformMDC } from '../../utils/transformMDC'
import { SITE_URL } from '../../utils/markdownNegotiation'

const DOMAIN = SITE_URL

/**
 * A missing page has to answer a real 404 so agents can tell an unknown URL
 * from an empty one. `server/error.ts` renders it as markdown for `/raw/**`,
 * reporting the documentation path the client asked for.
 */
function notFound(path: string) {
  return createError({ statusCode: 404, statusMessage: 'Page Not Found', data: { path } })
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    throw notFound(event.path)
  }

  let path = withLeadingSlash(slug.slice(0, -3))
  if (path.endsWith('/index')) {
    path = path.substring(0, path.length - 6)
  }

  const _collections = Object.entries(collections as unknown as Record<string, { type: string }>)
    .filter(([_key, value]) => value.type === 'page')
    .map(([key]) => key) as string[]

  let page: PageCollectionItemBase | null = null
  for (const collection of _collections) {
    page = await queryCollection(event, collection as keyof Collections).path(path).first() as PageCollectionItemBase | null
    if (page) break
  }

  if (!page) {
    throw notFound(path)
  }

  await transformMDC(event, page as any)

  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description])
    page.body.value.unshift(['h1', {}, page.title])
  }

  const canonicalUrl = `${DOMAIN}${page.path}`
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(page.title || '')}`,
    `description: ${JSON.stringify(page.description || '')}`,
    `canonical_url: ${JSON.stringify(canonicalUrl)}`,
    '---',
    ''
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setResponseHeader(event, 'Link', `<${canonicalUrl}>; rel="canonical", <${canonicalUrl}>; rel="alternate"; type="text/html"`)
  const body = stringify({ ...page.body, type: 'minimark' }, { format: 'markdown/html' })
  return frontmatter + body + '\n\n## Sitemap\n\nSee the full [sitemap](/sitemap.md) for all pages.\n'
})
