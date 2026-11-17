import { defineCachedEventHandler } from 'nitropack/runtime'
import { getQuery, createError } from 'h3'
import type { H3Event } from 'h3'
import { Octokit } from '@octokit/rest'

// The component changelog only asks for a component and its theme
const MAX_PATHS = 2
const PATH_RE = /^src\/(?:runtime\/components\/(?:[a-z-]+\/)?[A-Za-z0-9]+\.vue|theme\/(?:[a-z-]+\/)?[a-z0-9-]+\.ts)$/

function getPaths(event: H3Event): string[] {
  const query = getQuery(event) as { path?: string | string[] }
  const paths = [...new Set([query.path ?? []].flat())].sort()

  if (!paths.length || paths.length > MAX_PATHS || !paths.every(path => PATH_RE.test(path))) {
    throw createError({
      statusCode: 400,
      statusMessage: `Expected 1 to ${MAX_PATHS} component or theme paths`
    })
  }

  return paths
}

export default defineCachedEventHandler(async (event) => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const paths = getPaths(event)

  const octokit = new Octokit({
    auth: process.env.NUXT_GITHUB_TOKEN,
    request: { timeout: 10_000 }
  })

  const allCommits = await Promise.all(
    paths.map(path =>
      octokit.rest.repos.listCommits({
        owner: 'nuxt',
        repo: 'ui',
        path,
        since: '2025-03-12T14:33:00Z',
        per_page: 100
      }).then(res => res.data).catch(() => [])
    )
  )

  const uniqueCommits = new Map<string, { sha: string, date: string, message: string }>()
  for (const commits of allCommits) {
    for (const commit of commits) {
      if (!uniqueCommits.has(commit.sha)) {
        uniqueCommits.set(commit.sha, {
          sha: commit.sha,
          date: commit.commit.author?.date ?? '',
          message: (commit.commit.message?.split('\n')[0] ?? '')
        })
      }
    }
  }

  return Array.from(uniqueCommits.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}, {
  maxAge: 60 * 60, // 1 hour
  getKey: event => `commits-${getPaths(event).join(',')}`
})
