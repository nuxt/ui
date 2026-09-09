/** The releases, newest first. The notes are served per release by releases/[tag]. */
export default defineCachedEventHandler(async () => {
  return (await fetchReleases()).map(({ markdown, ...release }) => release)
}, {
  maxAge: 60 * 60,
  // the response carries `cache-control` and an etag, which the changelog on
  // every component page relies on
  getKey: () => 'releases-list'
})
