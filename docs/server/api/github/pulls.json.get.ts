import { Octokit } from '@octokit/rest'

function isUserABot(user: any) {
  return user?.login?.endsWith('-bot') || user?.login?.endsWith('[bot]')
}

export default defineCachedEventHandler(async () => {
  if (!process.env.NUXT_GITHUB_TOKEN) {
    return []
  }

  const octokit = new Octokit({ auth: process.env.NUXT_GITHUB_TOKEN })

  const pulls = await octokit.paginate(octokit.rest.pulls.list, {
    owner: 'nuxt',
    repo: 'ui',
    state: 'closed'
  })

  return pulls.filter(pull => !!pull.merged_at).filter(pull => !isUserABot(pull.user))
}, {
  maxAge: 60 * 60, // 1 hour
  getKey: () => 'pulls'
})
