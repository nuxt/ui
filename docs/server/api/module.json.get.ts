interface TeamMember {
  name: string
  login: string
  avatarUrl: string
  pronouns?: string
  location?: string
  websiteUrl?: string
  sponsorsListing?: string
  socialAccounts: Record<string, { displayName: string, url: string }>
}

interface Module {
  stats: {
    downloads: number
    stars: number
  }
  contributors: {
    username: string
  }[]
}

export default defineCachedEventHandler(async () => {
  const team = await $fetch<TeamMember[]>('https://nuxt.com/api/v1/teams/ui')
  const { stats, contributors } = await $fetch<Module>('https://nuxt.com/api/v1/modules/ui')

  return {
    team,
    stats,
    contributors
  }
}, {
  maxAge: 60 * 60, // 1 hour
  shouldBypassCache: () => !!import.meta.dev,
  getKey: () => 'module'
})
