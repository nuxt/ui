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

/**
 * GitHub links the `@name` mentions the notes are written with, ungh serves
 * them as plain text. Code, HTML and links already written as links are left
 * as they are, so an import of `@nuxt/ui` or an image named `@2x` stays put.
 */
const PROTECTED = /```[\s\S]*?```|`[^`\n]+`|<[^>]*>|\[[^\]]*\]\([^)]*\)/g
const MENTION = /(^|[^\w`/])@([a-z\d](?:[a-z\d-]{0,37}[a-z\d])?)(?![\w-]*\/)/gi

export function linkMentions(markdown: string) {
  const link = (text: string) => text.replace(MENTION, (_, before, name) => `${before}[@${name}](https://github.com/${name})`)

  let notes = ''
  let index = 0
  for (const match of markdown.matchAll(PROTECTED)) {
    notes += link(markdown.slice(index, match.index)) + match[0]
    index = match.index + match[0].length
  }

  return notes + link(markdown.slice(index))
}
