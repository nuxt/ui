export function useSearchLinks() {
  return [{
    label: 'Docs',
    icon: 'i-lucide-square-play',
    to: '/getting-started'
  }, {
    label: 'Components',
    icon: 'i-lucide-square-code',
    to: '/components'
  }, {
    icon: 'i-lucide-sparkles',
    label: 'Pro > Features',
    description: 'A collection of premium Vue components.',
    to: '/pro'
  }, {
    icon: 'i-lucide-credit-card',
    label: 'Pro > Pricing',
    description: 'Free in development, buy when ready to launch.',
    to: '/pro/pricing'
  }, {
    icon: 'i-lucide-panels-top-left',
    label: 'Pro > Templates',
    description: 'Official templates made with Nuxt UI Pro.',
    to: '/pro/templates'
  }, {
    icon: 'i-lucide-circle-check',
    label: 'Pro > Activate',
    description: 'Enable Nuxt UI Pro in your production projects.',
    to: '/pro/activate'
  }, {
    label: 'Figma',
    icon: 'i-simple-icons-figma',
    to: '/figma'
  }, {
    label: 'Community > Contribution',
    description: 'A comprehensive guide on contributing to Nuxt UI, including project structure, development workflow, and best practices.',
    icon: 'i-lucide-git-pull-request-arrow',
    to: '/getting-started/contribution'
  }, {
    label: 'Community > Roadmap',
    description: 'Track our development progress in real-time.',
    icon: 'i-lucide-map',
    to: '/roadmap'
  }, {
    label: 'Community > Devtools',
    description: 'Integrate Nuxt UI with Nuxt Devtools with Compodium.',
    icon: 'i-lucide-code',
    to: 'https://github.com/romhml/compodium',
    target: '_blank'
  }, {
    label: 'Community > Team',
    description: 'Meet the team behind Nuxt UI.',
    icon: 'i-lucide-users',
    to: '/team'
  }, {
    label: 'Releases',
    icon: 'i-lucide-rocket',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]
}
