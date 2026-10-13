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
    label: 'Contribution',
    to: '/docs/getting-started/contribution',
    active: route.path === '/docs/getting-started/contribution'
  }, {
    label: 'Team',
    to: '/team',
    active: route.path.startsWith('/team')
  }])

  return {
    links
  }
}
