import { parseMarkdown } from '@nuxtjs/mdc/runtime'

/** One release with its notes parsed, the tree and the headings the docs page renders. */
export default defineCachedEventHandler(async (event) => {
  const tag = getRouterParam(event, 'tag')
  const release = (await fetchReleases()).find(entry => entry.tag === tag)
  if (!release) {
    throw createError({ statusCode: 404, statusMessage: 'Release not found' })
  }

  const { markdown, ...meta } = release
  const { body, data, toc } = await parseMarkdown(markdown, { toc: { depth: 3, searchDepth: 3 } })

  return { ...meta, body, data, toc }
}, {
  maxAge: 60 * 60,
  getKey: event => `release-${getRouterParam(event, 'tag')}`
})
