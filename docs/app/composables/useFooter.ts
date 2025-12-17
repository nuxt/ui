export function useFooter() {
  const links = [{
    label: 'Blog',
    to: '/blog'
  }, {
    label: 'Templates',
    to: '/templates'
  }, {
    label: 'Showcase',
    to: '/showcase'
  }, {
    label: 'Team',
    to: '/team'
  }]

  return {
    links
  }
}
