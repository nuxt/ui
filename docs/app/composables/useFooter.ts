export function useFooter() {
  // The secondary destinations the header no longer carries (resources,
  // releases, figma) live here, next to the ones it never did.
  const links = [{
    label: 'Blog',
    to: '/blog'
  }, {
    label: 'Community',
    to: '/community'
  }, {
    label: 'Playground',
    to: '/play',
    target: '_blank'
  }, {
    label: 'Team',
    to: '/team'
  }]

  return {
    links
  }
}
