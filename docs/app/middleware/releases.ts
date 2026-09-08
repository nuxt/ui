/**
 * Loads the versions before the docs layout renders: its aside lists them,
 * so they have to be in state ahead of the page rather than fetched by it.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const releases = useReleases()
  if (!releases.value.length) {
    releases.value = (await fetchReleases()).map(release => ({
      tag: release.tag,
      title: release.name || release.tag,
      date: release.publishedAt
    }))
  }

  // The latest release lives on the section root, the nav links it there.
  // Its tagged URL is the same page under a path the nav never lights up.
  if (to.params.tag && to.params.tag === releases.value[0]?.tag) {
    return navigateTo('/docs/releases', { redirectCode: 301, replace: true })
  }
})
