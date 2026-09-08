export function useFooter() {
  const route = useRoute()

  const links = computed(() => [{
    label: 'Community',
    to: '/community',
    active: route.path.startsWith('/community')
  }, {
    label: 'Blog',
    to: '/blog',
    active: route.path.startsWith('/blog')
  }, {
    label: 'Team',
    to: '/team',
    active: route.path.startsWith('/team')
  }, {
    label: 'Playground',
    to: '/play',
    target: '_blank'
  }])

  return {
    links
  }
}
