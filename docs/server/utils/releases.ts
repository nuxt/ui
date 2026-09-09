export interface Release {
  tag: string
  /** The release name, its tag when it has none. */
  title: string
  date: string
  url: string
  /** The release notes, Markdown as GitHub stores them. */
  markdown: string
}

interface UnghRelease {
  tag: string
  name?: string
  publishedAt: string
  markdown: string
}

/** The stable v4 line: this site documents v4, and v4.0.0 supersedes its alphas and betas. */
export const DOCUMENTED = /^v4\.\d+\.\d+$/

/**
 * The releases of nuxt/ui through ungh, newest first, v2 left out. Cached
 * for an hour and shared by the list and the per-release routes, so ungh is
 * asked once for both.
 */
export const fetchReleases = defineCachedFunction(async (): Promise<Release[]> => {
  const { releases } = await $fetch<{ releases: UnghRelease[] }>('https://ungh.cc/repos/nuxt/ui/releases')

  return releases
    .filter(release => !release.tag.startsWith('v2'))
    .map(release => ({
      tag: release.tag,
      title: release.name || release.tag,
      date: release.publishedAt,
      url: `https://github.com/nuxt/ui/releases/tag/${release.tag}`,
      markdown: release.markdown
    }))
}, {
  maxAge: 60 * 60,
  name: 'releases',
  getKey: () => 'nuxt-ui'
})
