export function useSearch() {
  const route = useRoute()
  const { frameworks } = useFrameworks()
  const { track } = useAnalytics()
  const { open, ask } = useChat()
  // The ⌘K link glyphs follow the applied pack where an equivalent exists;
  // the docs-nav-specific ones (square-play/-code/-function, panels, etc.)
  // have no pack glyph and stay Lucide.
  const studioIcons = useStudioIcons()

  const searchTerm = ref('')

  function onSelect() {
    track('AI Chat Opened', { source: 'search', hasSearchTerm: !!searchTerm.value })

    if (searchTerm.value) {
      ask(searchTerm.value)
    } else {
      open.value = true
    }
  }

  const links = computed(() => [{
    label: 'Ask AI',
    icon: studioIcons.assistant,
    kbds: ['meta', 'i'],
    ui: {
      itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-primary'
    },
    onSelect
  }, {
    label: 'Get Started',
    description: 'Learn how to install and configure the library.',
    icon: 'i-lucide-square-play',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    description: 'Explore all available components.',
    icon: 'i-lucide-square-code',
    to: '/docs/components',
    active: route.path.startsWith('/docs/components')
  }, {
    label: 'Composables',
    description: 'Learn how to use the available composables.',
    icon: 'i-lucide-square-function',
    to: '/docs/composables',
    active: route.path.startsWith('/docs/composables')
  }, {
    label: 'Typography',
    description: 'Discover typography features and customization options.',
    icon: 'i-lucide-square-pilcrow',
    to: '/docs/typography',
    active: route.path.startsWith('/docs/typography')
  }, {
    label: 'Templates',
    description: 'Explore official starter templates.',
    icon: 'i-lucide-panels-top-left',
    to: '/templates'
  }, {
    label: 'Showcase',
    description: 'Discover websites built with the library.',
    icon: 'i-lucide-presentation',
    to: '/showcase'
  }, {
    label: 'Community',
    description: 'Explore community projects and resources.',
    icon: studioIcons.globe,
    to: '/community'
  }, {
    label: 'Playground',
    description: 'Try components live in your browser.',
    icon: 'i-lucide-square-terminal',
    to: '/play',
    target: '_blank'
  }, {
    label: 'Blog',
    description: 'Read articles and tutorials.',
    icon: 'i-lucide-newspaper',
    to: '/blog',
    active: route.path.startsWith('/blog')
  }, {
    label: 'Figma',
    description: 'Access the official Figma design kit.',
    icon: 'i-simple-icons-figma',
    to: '/figma'
  }, {
    label: 'Team',
    description: 'Meet the team behind the project.',
    icon: studioIcons.users,
    to: '/team'
  }, {
    label: 'Releases',
    description: 'Stay up to date with the latest changes.',
    icon: 'i-lucide-rocket',
    to: '/releases'
  }, {
    label: 'GitHub',
    description: 'Check out the repository on GitHub.',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }])

  const groups = computed(() => [{
    id: 'framework',
    label: 'Framework',
    items: frameworks.value
  }, {
    id: 'ai',
    label: 'AI',
    ignoreFilter: true,
    postFilter: (searchTerm: string, items: any[]) => {
      if (!searchTerm) {
        return []
      }

      return items
    },
    items: [{
      label: 'Ask AI',
      icon: studioIcons.assistant,
      ui: {
        itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-primary'
      },
      onSelect
    }]
  }])

  return {
    links,
    groups,
    searchTerm
  }
}
