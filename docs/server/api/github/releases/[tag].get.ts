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
  // Nitro strips every non-word character from a custom key, which would collide
  // `v4.11.0` with `v4.1.10`; underscores survive it
  getKey: event => `release-${getRouterParam(event, 'tag')?.replace(/\W/g, '_')}`
})
