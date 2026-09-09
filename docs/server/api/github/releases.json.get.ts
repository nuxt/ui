/** The releases the docs document, newest first. The notes are served per release by releases/[tag]. */
export default defineCachedEventHandler(async () => {
  return (await fetchReleases())
    .filter(release => DOCUMENTED.test(release.tag))
    .map(({ markdown, ...release }) => release)
}, {
  maxAge: 60 * 60,
  // the response carries `cache-control` and an etag, which the changelog on
  // every component page relies on
  getKey: () => 'releases-list'
})
