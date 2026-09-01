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
      label: 'Element',
      to: '/components#element',
      description: 'Button, badge, icon, alert, and small UI elements.',
      icon: 'i-lucide-mouse-pointer',
      active: route.fullPath === '/components#element'
    }, {
      label: 'Form',
      to: '/components#form',
      description: 'Input, select, checkbox, radio and form validation.',
      icon: 'i-lucide-text-cursor-input',
      active: route.fullPath === '/components#form'
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
    }, {
      label: 'Layout',
      to: '/components#layout',
      description: 'Container, grid, divider and responsive layout.',
      icon: 'i-lucide-layout',
      active: route.fullPath === '/components#layout'
    }]
  }])
}
