export interface Release {
  tag: string
  /** The release name, its tag when it has none. */
  title: string
  date: string
  url: string
  /** The release notes, Markdown as GitHub stores them. */
  markdown: string
}

interface GitHubRelease {
  tag_name: string
  name: string | null
  published_at: string
  html_url: string
  body: string | null
  draft: boolean
  prerelease: boolean
}

/**
 * The releases of nuxt/ui from the GitHub API, newest first, drafts and v2 left
 * out. One page of 100 covers the documented line for years. Cached for an hour
 * and shared by the list and the per-release routes, so GitHub is asked once for
 * both: the token is optional, unauthenticated calls are rate limited to 60 an
 * hour per IP which the cache keeps comfortable.
 */
export const fetchReleases = defineCachedFunction(async (): Promise<Release[]> => {
  const releases = await $fetch<GitHubRelease[]>('https://api.github.com/repos/nuxt/ui/releases', {
    query: { per_page: 100 },
    headers: {
      'Accept': 'application/vnd.github+json',
      // GitHub rejects requests without one
      'User-Agent': 'nuxt-ui-docs',
      ...(process.env.NUXT_GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.NUXT_GITHUB_TOKEN}` } : {})
    }
  })

  return releases
    .filter(release => !release.draft && !release.tag_name.startsWith('v2'))
    .map(release => ({
      tag: release.tag_name,
      title: release.name || release.tag_name,
      date: release.published_at,
      url: release.html_url,
      markdown: release.body || ''
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}, {
  maxAge: 60 * 60,
  name: 'releases',
  getKey: () => 'nuxt-ui'
})
