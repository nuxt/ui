export function useSearchLinks() {
  return [{
    label: 'Docs',
    icon: 'i-lucide-square-play',
    to: '/docs/getting-started'
  }, {
    label: 'Figma',
    icon: 'i-simple-icons-figma',
    to: '/figma'
  }, {
    icon: 'i-lucide-panels-top-left',
    label: 'Templates',
    description: 'Official templates made with Nuxt UI.',
    to: '/templates'
  }, {
    icon: 'i-lucide-presentation',
    label: 'Showcase',
    description: 'Check out some of the amazing projects built with Nuxt UI.',
    to: '/showcase'
  }, {
    label: 'Team',
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
