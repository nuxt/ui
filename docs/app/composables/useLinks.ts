export function useLinks() {
  const route = useRoute()

  return computed(() => [{
    label: 'Docs',
    icon: 'i-lucide-square-play',
    to: '/getting-started',
    active: route.path.startsWith('/getting-started') || route.path.startsWith('/composables/') || (route.path.startsWith('/components/') && route.name !== 'components')
  }, {
    label: 'Components',
    icon: 'i-lucide-square-code',
    to: '/components'
  }, {
    label: 'Pro',
    icon: 'i-lucide-panels-top-left',
    to: '/pro',
    active: route.path.startsWith('/pro'),
    orientation: 'vertical',
    children: [{
      icon: 'i-lucide-sparkles',
      label: 'Features',
      description: 'A collection of premium Vue components.',
      to: '/pro'
    }, {
      icon: 'i-lucide-credit-card',
      label: 'Pricing',
      description: 'Free in development, buy when ready to launch.',
      to: '/pro/pricing',
      active: route.path.startsWith('/pro/pricing')
    }, {
      icon: 'i-lucide-panels-top-left',
      label: 'Templates',
      description: 'Official templates made with Nuxt UI Pro.',
      to: '/pro/templates'
    }, {
      icon: 'i-lucide-circle-check',
      label: 'Activate',
      description: 'Enable Nuxt UI Pro in your production projects.',
      to: '/pro/activate'
    }]
  }, {
    label: 'Figma',
    icon: 'i-lucide-figma',
    to: '/figma'
  }, {
    label: 'Roadmap',
    icon: 'i-lucide-map',
    to: '/roadmap'
  }, {
    label: 'Releases',
    icon: 'i-lucide-rocket',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }].filter(Boolean))
}
