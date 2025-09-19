export function useFooter() {
  const links = [{
    label: 'Figma',
    to: '/figma'
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
