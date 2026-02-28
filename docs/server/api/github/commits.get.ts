import { Octokit } from '@octokit/rest'

const MAX_RETRIES = 3
const REQUEST_TIMEOUT = 10_000

async function fetchCommitsForPath(octokit: Octokit, path: string, retries = MAX_RETRIES): Promise<any[]> {
  try {
    return await octokit.paginate(octokit.rest.repos.listCommits, {
      owner: 'nuxt',
      repo: 'ui',
      path,
      since: '2025-03-12T14:33:00Z',
      request: { timeout: REQUEST_TIMEOUT }
    })
  } catch (error: any) {
    if (retries > 0 && (error.status === 500 || error.status >= 502 || error.message?.includes('socket') || error.message?.includes('ECONNRESET') || error.message?.includes('TLS'))) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (MAX_RETRIES - retries + 1)))
      return fetchCommitsForPath(octokit, path, retries - 1)
    }
    throw error
  }
}

export default defineCachedEventHandler(async (event) => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const query = getQuery(event) as { path: string | string[] }
  const paths = Array.isArray(query.path) ? query.path : [query.path]

  if (!paths.length || !paths[0]) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required'
    })
  }

  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN })

  const allCommits = await Promise.all(
    paths.map(path => fetchCommitsForPath(octokit, path))
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
  getKey: (event) => {
    const query = getQuery(event) as { path: string | string[] }
    const paths = Array.isArray(query.path) ? query.path : [query.path]
    return `commits-${paths.sort().join(',')}`
  }
})
