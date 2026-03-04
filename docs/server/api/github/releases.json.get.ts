import { Octokit } from '@octokit/rest'

export default defineCachedEventHandler(async () => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN })

  const { data: releases } = await octokit.rest.repos.listReleases({
    owner: 'nuxt',
    repo: 'ui'
  })

  return releases.filter(r => !r.tag_name.startsWith('v2'))
}, {
  maxAge: 60 * 60, // 1 hour
  getKey: () => 'releases'
})
