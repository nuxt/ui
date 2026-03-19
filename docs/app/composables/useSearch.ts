export function useSearch() {
  const route = useRoute()
  const { frameworks } = useFrameworks()
  const { track } = useAnalytics()
  const { open, messages } = useChat()

  const searchTerm = ref('')

  function onSelect() {
    track('AI Chat Opened', { hasSearchTerm: !!searchTerm.value })

    if (searchTerm.value) {
      messages.value = [...messages.value, {
        id: String(Date.now()),
        role: 'user',
        parts: [{ type: 'text', text: searchTerm.value }]
      }]
    }

    open.value = true
  }

  const links = computed(() => [!searchTerm.value && {
    label: 'Ask AI',
    description: 'Ask the AI assistant powered by our custom MCP server for help.',
    icon: 'i-lucide-bot',
    kbds: ['meta', 'i'],
    ui: {
      itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-primary'
    },
    onSelect
  }, {
    label: 'Get Started',
    description: 'Learn how to get started with Nuxt UI.',
    icon: 'i-lucide-square-play',
    to: '/docs/getting-started',
    active: route.path.startsWith('/docs/getting-started')
  }, {
    label: 'Components',
    description: 'Explore the components available in Nuxt UI.',
    icon: 'i-lucide-square-code',
    to: '/docs/components',
    active: route.path.startsWith('/docs/components')
  }, {
    label: 'Composables',
    description: 'Learn how to use the composables available in Nuxt UI.',
    icon: 'i-lucide-square-function',
    to: '/docs/composables',
    active: route.path.startsWith('/docs/composables')
  }, {
    label: 'Typography',
    description: 'Discover the typography features and customization options in Nuxt UI.',
    icon: 'i-lucide-square-pilcrow',
    to: '/docs/typography',
    active: route.path.startsWith('/docs/typography')
  }, {
    label: 'Templates',
    description: 'Explore official templates built with Nuxt UI.',
    icon: 'i-lucide-panels-top-left',
    to: '/templates'
  }, {
    label: 'Showcase',
    description: 'Discover websites built with Nuxt UI.',
    icon: 'i-lucide-presentation',
    to: '/showcase'
  }, {
    label: 'Community',
    description: 'Explore projects built around Nuxt UI.',
    icon: 'i-lucide-globe',
    to: '/community'
  }, {
    label: 'Playground',
    description: 'Try Nuxt UI components live in your browser.',
    icon: 'i-lucide-square-terminal',
    to: '/play',
    target: '_blank'
  }, {
    label: 'Blog',
    description: 'Learn how to build things with Nuxt UI.',
    icon: 'i-lucide-newspaper',
    to: '/blog',
    active: route.path.startsWith('/blog')
  }, {
    label: 'Figma',
    description: 'Access the official Nuxt UI Figma design kit to streamline your design workflow.',
    icon: 'i-simple-icons-figma',
    to: '/figma'
  }, {
    label: 'Team',
    description: 'Meet the team building and maintaining Nuxt UI.',
    icon: 'i-lucide-users',
    to: '/team'
  }, {
    label: 'Releases',
    description: 'Stay up to date with the newest features, enhancements, and fixes for Nuxt UI.',
    icon: 'i-lucide-rocket',
    to: '/releases'
  }, {
    label: 'GitHub',
    description: 'Check out the Nuxt UI repository and follow development on GitHub.',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }].filter(link => !!link))

  const groups = computed(() => [{
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
      icon: 'i-lucide-bot',
      ui: {
        itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-primary'
      },
      onSelect
    }]
  }, {
    id: 'framework',
    label: 'Framework',
    items: frameworks.value
  }])

  return {
    links,
    groups,
    searchTerm
  }
}
