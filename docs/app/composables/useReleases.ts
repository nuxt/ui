import type { ContentNavigationItem } from '@nuxt/content'

/** A version as the nav and the page header list it. */
export interface Release {
  tag: string
  title: string
  date: string
  url: string
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
