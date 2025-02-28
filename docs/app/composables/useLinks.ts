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
    to: '/components',
    active: route.path === '/components',
    children: [{
      label: 'Layout',
      to: '/components#layout',
      description: 'Container, grid, divider and responsive layout.',
      icon: 'i-lucide-layout',
      active: route.fullPath === '/components#layout'
    }, {
      label: 'Form',
      to: '/components#form',
      description: 'Input, select, checkbox, radio and form validation.',
      icon: 'i-lucide-text-cursor-input',
      active: route.fullPath === '/components#form'
    }, {
      label: 'Element',
      to: '/components#element',
      description: 'Button, badge, icon, alert, and small UI elements.',
      icon: 'i-lucide-mouse-pointer',
      active: route.fullPath === '/components#element'
    }, {
      label: 'Data',
      to: '/components#data',
      description: 'Table, list, card, carousel and visualization elements.',
      icon: 'i-lucide-table',
      active: route.fullPath === '/components#data'
    }, {
      label: 'Navigation',
      to: '/components#navigation',
      description: 'Menu, breadcrumb, pagination and navbar.',
      icon: 'i-lucide-link',
      active: route.fullPath === '/components#navigation'
    }, {
      label: 'Overlay',
      to: '/components#overlay',
      description: 'Modal, tooltip, dialog and popover.',
      icon: 'i-lucide-layers',
      active: route.fullPath === '/components#overlay'
    }]
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
    icon: 'i-simple-icons-figma',
    to: '/figma'
  }, {
    label: 'Community',
    icon: 'i-lucide-users',
    children: [{
      label: 'Roadmap',
      description: 'Track our development progress in real-time.',
      icon: 'i-lucide-map',
      to: '/roadmap'
    }, {
      label: 'Devtools Integration',
      description: 'Integrate Nuxt UI with Nuxt Devtools with Compodium.',
      icon: 'i-lucide-code',
      to: 'https://github.com/romhml/compodium',
      target: '_blank'
    }, {
      label: 'Raycast Extension',
      description: 'Access Nuxt UI components without leaving your editor.',
      icon: 'i-simple-icons-raycast',
      to: 'https://github.com/HugoRCD/nuxt-ui-raycast-extension',
      target: '_blank'
    }, {
      label: 'Figma to Code',
      description: 'Convert Figma designs to Nuxt UI code.',
      icon: 'i-simple-icons-figma',
      to: 'https://github.com/Justineo/tempad-dev-plugin-nuxt-ui',
      target: '_blank'
    }]
  }, {
    label: 'Releases',
    icon: 'i-lucide-rocket',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }].filter(Boolean))
}
