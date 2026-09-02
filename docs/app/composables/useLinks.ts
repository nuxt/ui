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
    active: route.path === '/components'
  }])
}
