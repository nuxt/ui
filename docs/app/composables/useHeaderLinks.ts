export function useHeaderLinks() {
  const route = useRoute()

  return computed(() => [{
    label: 'Docs',
    icon: 'i-lucide-square-play',
    to: '/docs',
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    icon: 'i-lucide-square-code',
    to: '/docs/components',
    active: route.path.startsWith('/docs/components')
    // children: [{
    //   label: 'Element',
    //   to: '/components#element',
    //   description: 'Button, badge, icon, alert, and small UI elements.',
    //   icon: 'i-lucide-mouse-pointer',
    //   active: route.fullPath === '/components#element'
    // }, {
    //   label: 'Form',
    //   to: '/components#form',
    //   description: 'Input, select, checkbox, radio and form validation.',
    //   icon: 'i-lucide-text-cursor-input',
    //   active: route.fullPath === '/components#form'
    // }, {
    //   label: 'Data',
    //   to: '/components#data',
    //   description: 'Table, list, card, carousel and visualization elements.',
    //   icon: 'i-lucide-table',
    //   active: route.fullPath === '/components#data'
    // }, {
    //   label: 'Navigation',
    //   to: '/components#navigation',
    //   description: 'Menu, breadcrumb, pagination and navbar.',
    //   icon: 'i-lucide-link',
    //   active: route.fullPath === '/components#navigation'
    // }, {
    //   label: 'Overlay',
    //   to: '/components#overlay',
    //   description: 'Modal, tooltip, dialog and popover.',
    //   icon: 'i-lucide-layers',
    //   active: route.fullPath === '/components#overlay'
    // }, {
    //   label: 'Layout',
    //   to: '/components#layout',
    //   description: 'Container, grid, divider and responsive layout.',
    //   icon: 'i-lucide-layout',
    //   active: route.fullPath === '/components#layout'
    // }]
  }, {
    label: 'Figma',
    icon: 'i-simple-icons-figma',
    description: 'The official Nuxt UI design kit for Figma mirrors the development library for perfect consistency.',
    to: '/figma'
  }, {
    icon: 'i-lucide-panels-top-left',
    label: 'Templates',
    description: 'Official templates made with Nuxt UI.',
    to: '/templates'
  }, {
    label: 'Community',
    icon: 'i-lucide-users',
    children: [{
      icon: 'i-lucide-presentation',
      label: 'Showcase',
      description: 'Check out some amazing projects built with Nuxt UI.',
      to: '/showcase'
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
      to: 'https://www.raycast.com/HugoRCD/nuxt',
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
    description: 'Stay up to date with the latest releases of Nuxt UI.',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }])
}
