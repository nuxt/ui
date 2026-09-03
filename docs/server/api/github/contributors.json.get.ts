import { Octokit } from '@octokit/rest'

/** A row of the team page: the GitHub count plus whatever the profile makes public. */
export interface Contributor {
  username: string
  contributions: number
  name?: string
  location?: string
  websiteUrl?: string
  /** Provider as GitHub names it, lowercased (`twitter`, `bluesky`, `linkedin`, ...). */
  socialAccounts?: { provider: string, url: string }[]
  sponsorsListing?: string
}

export interface Contributors {
  /** Every human contributor on GitHub, null when the server has no token to count them. */
  total: number | null
  /** The most active ones, most contributions first. */
  contributors: Contributor[]
}

/** How many contributors the page profiles, the rest are a link away on GitHub. */
const LIMIT = 12

const REPO = { owner: 'nuxt', repo: 'ui' }

interface Profile {
  name: string | null
  location: string | null
  websiteUrl: string | null
  socialAccounts: { nodes: { provider: string, url: string }[] }
  /** `sponsorsListing` itself is only readable by its owner, the flag is public. */
  hasSponsorsListing: boolean
}

interface TeamMember {
  login: string
  name: string
  location?: string
  websiteUrl?: string
  sponsorsListing?: string
  socialAccounts: Record<string, { displayName: string, url: string }>
}

interface Module {
  contributors: { username: string, contributions: number }[]
}

/** Website URLs come back as typed into the profile, often without a scheme. */
function absolute(url?: string | null) {
  if (!url) return undefined
  return /^https?:\/\//.test(url) ? url : `https://${url}`
}

/** Free text, and a few profiles joke with the field. */
function location(value?: string | null) {
  return value && !['undefined', 'null'].includes(value.trim().toLowerCase()) ? value : undefined
}

/** One GraphQL query for the whole batch, an alias per login. */
async function fetchProfiles(octokit: Octokit, logins: string[]) {
  const query = `query { ${logins.map((login, index) => `u${index}: user(login: ${JSON.stringify(login)}) { ...Profile }`).join(' ')} }
fragment Profile on User { name location websiteUrl socialAccounts(first: 10) { nodes { provider url } } hasSponsorsListing }`

  let data: Record<string, Profile | null>
  try {
    data = await octokit.graphql<Record<string, Profile | null>>(query)
  } catch (error) {
    // a deleted account fails its own alias only, the rest still resolve
    data = (error as { data?: Record<string, Profile | null> }).data ?? {}
  }

  return Object.fromEntries(logins.map((login, index) => [login, data[`u${index}`] ?? null]))
}

async function fromGitHub(token: string): Promise<Contributors> {
  const octokit = new Octokit({ auth: token })

  const all = await octokit.paginate(octokit.rest.repos.listContributors, { ...REPO, per_page: 100 })
  const humans = all.filter(contributor => contributor.type === 'User' && contributor.login)
  const top = humans.slice(0, LIMIT)
  const profiles = await fetchProfiles(octokit, top.map(contributor => contributor.login!))

  return {
    total: humans.length,
    contributors: top.map((contributor) => {
      const profile = profiles[contributor.login!]

      return {
        username: contributor.login!,
        contributions: contributor.contributions,
        name: profile?.name || undefined,
        location: location(profile?.location),
        websiteUrl: absolute(profile?.websiteUrl),
        socialAccounts: profile?.socialAccounts.nodes.map(account => ({ provider: account.provider.toLowerCase(), url: account.url })),
        sponsorsListing: profile?.hasSponsorsListing ? `https://github.com/sponsors/${contributor.login}` : undefined
      }
    })
  }
}

/** Without a token: nuxt.com's first page of contributors, with profiles for the team only. */
async function fromNuxtCom(): Promise<Contributors> {
  const [{ contributors }, team] = await Promise.all([
    $fetch<Module>('https://nuxt.com/api/v1/modules/ui'),
    $fetch<TeamMember[]>('https://nuxt.com/api/v1/teams/ui')
  ])

  return {
    total: null,
    contributors: [...contributors]
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, LIMIT)
      .map((contributor) => {
        const member = team.find(user => user.login === contributor.username)

        return {
          username: contributor.username,
          contributions: contributor.contributions,
          name: member?.name,
          location: location(member?.location),
          websiteUrl: absolute(member?.websiteUrl),
          socialAccounts: member && Object.entries(member.socialAccounts).map(([provider, account]) => ({ provider, url: account.url })),
          sponsorsListing: member?.sponsorsListing
        }
      })
  }
}

export default defineCachedEventHandler(async (): Promise<Contributors> => {
  const token = process.env.NUXT_GITHUB_TOKEN

  return token ? fromGitHub(token) : fromNuxtCom()
}, {
  maxAge: 60 * 60, // 1 hour
  getKey: () => 'contributors'
})
