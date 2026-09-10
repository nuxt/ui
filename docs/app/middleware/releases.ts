/**
 * Loads the versions before the docs layout renders: its aside lists them,
 * so they have to be in state ahead of the page rather than fetched by it.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const releases = useReleases()
  if (!releases.value.length) {
    try {
      // typed explicitly: assigning the route's inferred type straight to the
      // state ref sends TypeScript down its route table
      releases.value = await $fetch<Release[]>('/api/github/releases.json')
    } catch (error) {
      // GitHub can be unreachable: the page renders an empty state rather than
      // failing every navigation and the prerender crawl with it
      console.warn('[releases] could not load the release list', error)
      releases.value = []
    }
  }

  // The latest release lives on the section root, the nav links it there.
  // Its tagged URL is the same page under a path the nav never lights up.
  if (to.params.tag && to.params.tag === releases.value[0]?.tag) {
    return navigateTo('/docs/releases', { redirectCode: 302, replace: true })
  }
})
