import type { ContentNavigationItem } from '@nuxt/content'

export interface Release {
  tag: string
  title: string
  date: string
}

interface UnghRelease {
  name?: string
  tag: string
  publishedAt: string
  markdown: string
}

let cache: { at: number, releases: Promise<UnghRelease[]> } | undefined

/** The stable v4 line: this site documents v4, and v4.0.0 supersedes its alphas and betas. */
const DOCUMENTED = /^v4\.\d+\.\d+$/

/**
 * The GitHub releases through ungh, newest first. One request an hour on the
 * server, one a session in the browser. The notes stay out of the payload, a
 * page parses the one it shows.
 */
export function fetchReleases() {
  if (!cache || (import.meta.server && Date.now() - cache.at > 60 * 60 * 1000)) {
    const releases = $fetch<{ releases: UnghRelease[] }>('https://ungh.cc/repos/nuxt/ui/releases')
      .then(data => data.releases.filter(release => DOCUMENTED.test(release.tag)))
    // a failed request must not be served for the next hour
    releases.catch(() => {
      cache = undefined
    })
    cache = { at: Date.now(), releases }
  }

  return cache.releases
}

/** The versions, loaded by the `releases` middleware so the docs aside has them at render. */
export const useReleases = () => useState<Release[]>('releases', () => [])

/** The latest release is the section root, the others live under their tag. */
export function releasePath(releases: Release[], tag: string) {
  return tag === releases[0]?.tag ? '/docs/releases' : `/docs/releases/${tag}`
}

/** The section nav of /docs/releases: the versions as its pages. */
export function releasesNavigation(releases: Release[]): ContentNavigationItem[] {
  if (!releases.length) {
    return []
  }

  return [{
    title: 'Versions',
    path: '/docs/releases',
    children: releases.map((release) => {
      const path = releasePath(releases, release.tag)
      // the latest sits on the section root, which would otherwise read as an
      // active parent of every other version
      return { title: release.title, path, exact: path === '/docs/releases' }
    })
  }]
}
