import { Octokit } from '@octokit/rest'
import { kebabCase } from 'scule'

interface CommitInfo {
  components?: string[]
  version?: string
  hash: string
  date: string
  message: string
  refs?: string
  body?: string
  author_name: string
  author_email: string
}

export default defineCachedEventHandler(async () => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN })

  const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
    owner: 'nuxt',
    repo: 'ui',
    since: '2025-03-12T14:33:00Z'
  })

  // Filter commits based on message patterns
  const filteredCommits = commits?.filter((commit) => {
    return commit.commit.message.includes('chore(release)')
      || commit.commit.message.includes('!')
      || commit.commit.message.startsWith('feat')
      || commit.commit.message.startsWith('fix')
  })

  // Process commits in parallel batches
  const BATCH_SIZE = 10 // Process 10 commits at a time
  const processedCommits: CommitInfo[] = []

  for (let i = 0; i < filteredCommits.length; i += BATCH_SIZE) {
    const batch = filteredCommits.slice(i, i + BATCH_SIZE)

    const batchPromises = batch.map(async (commit) => {
      // Extract only the first line of the commit message
      const firstLine = commit.commit.message.split('\n')[0]?.trim() || ''

      const commitInfo: CommitInfo = {
        hash: commit.sha,
        date: commit.commit.author?.date || '',
        message: firstLine, // Use only the first line
        author_name: commit.commit.author?.name || '',
        author_email: commit.commit.author?.email || '',
        refs: commit.parents?.[0]?.sha
      }

      // Check if it's a release commit (using the first line)
      if (firstLine.includes('chore(release)')) {
        commitInfo.version = firstLine.split(' ')[1]?.trim()
        return commitInfo
      }

      // Only fetch details for non-release commits
      try {
        const { data: commitData } = await octokit.rest.repos.getCommit({
          owner: 'nuxt',
          repo: 'ui',
          ref: commit.sha
        })

        // Extract component names from changed files
        const files = commitData.files?.map(file => file.filename) || []

        commitInfo.components = [...new Set(files.map((filePath) => {
          const match = filePath.match(/^src\/runtime\/components\/(.+)\.vue$/)
          if (!match) return ''

          const fullPath = match[1]!
          const parts = fullPath.split('/')

          if (parts.length > 1) {
            const subdir = parts[0]
            const componentName = parts[parts.length - 1]!

            if (subdir === 'prose') {
              return `prose-${kebabCase(componentName)}`
            }

            return kebabCase(componentName)
          }

          return kebabCase(fullPath)
        }).filter(Boolean) as string[])]

        // Only return if has components
        if (commitInfo.components?.length) {
          return commitInfo
        }
      } catch (error) {
        console.error(`Failed to get files for commit ${commit.sha}:`, error)
      }

      return null
    })

    // Wait for batch to complete and filter out nulls
    const batchResults = await Promise.allSettled(batchPromises)

    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        processedCommits.push(result.value)
      }
    }
  }

  return processedCommits
}, {
  maxAge: 60 * 60,
  getKey: () => 'commits'
})
