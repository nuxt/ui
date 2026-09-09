/** One release with its notes, which the list route leaves out. */
export default defineCachedEventHandler(async (event) => {
  const tag = getRouterParam(event, 'tag')
  const release = (await fetchReleases()).find(entry => entry.tag === tag)
  if (!release) {
    throw createError({ statusCode: 404, statusMessage: 'Release not found' })
  }

  return release
}, {
  maxAge: 60 * 60,
  getKey: event => `release-${getRouterParam(event, 'tag')}`
})
