/**
 * Loads the versions before the docs layout renders: its aside lists them,
 * so they have to be in state ahead of the page rather than fetched by it.
 */
export default defineNuxtRouteMiddleware(async () => {
  const releases = useReleases()
  if (releases.value.length) {
    return
  }

  releases.value = (await fetchReleases()).map(release => ({
    tag: release.tag,
    title: release.name || release.tag,
    date: release.publishedAt
  }))
})
