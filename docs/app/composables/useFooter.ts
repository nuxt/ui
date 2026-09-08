export function useFooter() {
  const route = useRoute()

  const links = computed(() => [{
    label: 'Blog',
    to: '/blog',
    active: route.path.startsWith('/blog')
  }, {
    label: 'Community',
    to: '/community',
    active: route.path.startsWith('/community')
  }, {
    label: 'Playground',
    to: '/play',
    target: '_blank'
  }, {
    label: 'Team',
    to: '/team',
    active: route.path.startsWith('/team')
  }])

  return {
    links
  }
}
