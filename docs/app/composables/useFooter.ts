export function useFooter() {
  const links = [{
    label: 'Docs',
    to: '/docs'
  }, {
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
  }, {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]

  return {
    links
  }
}
