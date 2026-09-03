export function useHeader() {
  const route = useRoute()

  const desktopLinks = computed(() => [{
    label: 'Docs',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    to: '/docs/components',
    active: route.path.startsWith('/docs/components')
  }, {
    label: 'Theme',
    to: '/theme'
  }, {
    label: 'Templates',
    to: '/templates'
  }, {
    label: 'Showcase',
    to: '/showcase'
  }])

  const mobileLinks = computed(() => [{
    label: 'Get Started',
    icon: 'i-lucide-square-play',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    icon: 'i-lucide-square-code',
    to: '/docs/components',
    active: route.path.startsWith('/docs/components')
  }, {
    label: 'Composables',
    icon: 'i-lucide-square-function',
    to: '/docs/composables',
    active: route.path.startsWith('/docs/composables')
  }, {
    label: 'Typography',
    icon: 'i-lucide-square-pilcrow',
    to: '/docs/typography',
    active: route.path.startsWith('/docs/typography')
  }, {
    label: 'Templates',
    icon: 'i-lucide-panels-top-left',
    to: '/templates'
  }, {
    label: 'Showcase',
    icon: 'i-lucide-presentation',
    to: '/showcase'
  }, {
    label: 'Community',
    icon: 'i-lucide-globe',
    to: '/community'
  }, {
    label: 'Playground',
    icon: 'i-lucide-square-terminal',
    to: '/play',
    target: '_blank'
  }, {
    label: 'Blog',
    icon: 'i-lucide-newspaper',
    to: '/blog',
    active: route.path.startsWith('/blog')
  }, {
    label: 'Figma',
    icon: 'i-simple-icons-figma',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  }, {
    label: 'GitHub',
    to: 'https://github.com/nuxt/ui',
    icon: 'i-simple-icons-github',
    target: '_blank'
  }])

  return {
    desktopLinks,
    mobileLinks
  }
}
