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

/** Pages of 100, enough for the whole v3, v4 and v5 lines with room to grow. */
const MAX_PAGES = 3

/**
 * The releases of nuxt/ui from the GitHub API, newest first, drafts and v2 left
 * out. Paginated so the oldest documented tags stay in the list as the window
 * fills with prereleases. Cached for an hour and shared by the list and the
 * per-release routes, so GitHub is asked once for both: the token is optional,
 * unauthenticated calls are rate limited to 60 an hour per IP which the cache
 * keeps comfortable.
 */
export const fetchReleases = defineCachedFunction(async (): Promise<Release[]> => {
  const headers = {
    'Accept': 'application/vnd.github+json',
    // GitHub rejects requests without one
    'User-Agent': 'nuxt-ui-docs',
    ...(process.env.NUXT_GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.NUXT_GITHUB_TOKEN}` } : {})
  }

  const releases: GitHubRelease[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await $fetch<GitHubRelease[]>('https://api.github.com/repos/nuxt/ui/releases', {
      query: { per_page: 100, page },
      headers
    })

    releases.push(...batch)

    // A short page is the last one
    if (batch.length < 100) {
      break
    }
  }

  return releases
    // v3 is the oldest documented line, the pages before it live elsewhere
    .filter(release => !release.draft && !/^v[012]\./.test(release.tag_name))
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
