export function useSearch() {
  const route = useRoute()

  const links = computed(() => [{
    label: 'Get Started',
    description: 'Learn how to get started with Nuxt UI.',
    icon: 'i-lucide-square-play',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    description: 'Explore the components available in Nuxt UI.',
    icon: 'i-lucide-square-code',
    to: '/docs/components',
    active: route.path.startsWith('/docs/components')
  }, {
    label: 'Composables',
    description: 'Learn how to use the composables available in Nuxt UI.',
    icon: 'i-lucide-square-function',
    to: '/docs/composables',
    active: route.path.startsWith('/docs/composables')
  }, {
    label: 'Typography',
    description: 'Discover the typography features and customization options in Nuxt UI.',
    icon: 'i-lucide-square-pilcrow',
    to: '/docs/typography',
    active: route.path.startsWith('/docs/typography')
  }, {
    label: 'Figma',
    description: 'Access the official Nuxt UI Figma design kit to streamline your design workflow.',
    icon: 'i-simple-icons-figma',
    to: '/figma'
  }, {
    icon: 'i-lucide-panels-top-left',
    label: 'Templates',
    description: 'Explore official templates built with Nuxt UI.',
    to: '/templates'
  }, {
    icon: 'i-lucide-presentation',
    label: 'Showcase',
    description: 'Explore some of the amazing projects built with Nuxt UI.',
    to: '/showcase'
  }, {
    label: 'Team',
    description: 'Meet the team building and maintaining Nuxt UI.',
    icon: 'i-lucide-users',
    to: '/team'
  }, {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    description: 'Check out the Nuxt UI repository and follow development on GitHub.',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }])

  return {
    links
  }
}
