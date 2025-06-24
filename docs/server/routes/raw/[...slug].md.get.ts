import { stringify } from 'minimark/stringify'
import { withLeadingSlash } from 'ufo'

export default eventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  const path = withLeadingSlash(slug.replace('.md', ''))
  // @ts-expect-error TODO: fix this
  const page = await queryCollection(event, 'content').path(path).first()
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  // Add title and description to the top of the page if missing
  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description])
    page.body.value.unshift(['h1', {}, page.title])
  }

  const transformedPage = transformMDC({
    title: page.title,
    body: page.body
  })

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return stringify({ ...transformedPage.body, type: 'minimark' }, { format: 'markdown/html' })
})
