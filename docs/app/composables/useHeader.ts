export function useHeader() {
  const route = useRoute()
  // the mobile menu glyphs follow the applied icon pack
  const studioIcons = useStudioIcons()

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
    icon: studioIcons.squarePlay,
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    icon: studioIcons.squareCode,
    to: '/docs/components',
    active: route.path.startsWith('/docs/components')
  }, {
    label: 'Composables',
    icon: studioIcons.squareFunction,
    to: '/docs/composables',
    active: route.path.startsWith('/docs/composables')
  }, {
    label: 'Typography',
    icon: studioIcons.squarePilcrow,
    to: '/docs/typography',
    active: route.path.startsWith('/docs/typography')
  }, {
    label: 'Releases',
    icon: studioIcons.rocket,
    to: '/docs/releases',
    active: route.path.startsWith('/docs/releases')
  }, {
    label: 'Templates',
    icon: studioIcons.templates,
    to: '/templates'
  }, {
    label: 'Showcase',
    icon: studioIcons.presentation,
    to: '/showcase'
  }, {
    label: 'Community',
    icon: studioIcons.globe,
    to: '/community'
  }, {
    label: 'Blog',
    icon: studioIcons.newspaper,
    to: '/blog'
  }, {
    label: 'Team',
    icon: studioIcons.users,
    to: '/team'
  }, {
    label: 'Playground',
    icon: studioIcons.terminal,
    to: '/play',
    target: '_blank'
  }, {
    label: 'Figma',
    icon: studioIcons.figma,
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
