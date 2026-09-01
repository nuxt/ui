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
    label: 'Community > Contribution',
    description: 'A comprehensive guide on contributing to Nuxt UI, including project structure, development workflow, and best practices.',
    icon: 'i-lucide-git-pull-request-arrow',
    to: '/getting-started/contribution'
  }, {
    label: 'Community > Devtools',
    description: 'Integrate Nuxt UI with Nuxt Devtools with Compodium.',
    icon: 'i-lucide-code',
    to: 'https://github.com/romhml/compodium',
    target: '_blank'
  }, {
    label: 'Releases',
    icon: 'i-lucide-rocket',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]
}
