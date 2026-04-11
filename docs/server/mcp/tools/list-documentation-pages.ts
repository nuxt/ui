import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Lists all Nuxt UI documentation pages including components, composables, getting started guides, and configuration references',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  cache: '1h',
  async handler() {
    const event = useEvent()

    const pages = await queryCollection(event, 'docs').all()

    return pages.map(doc => ({
      title: doc.title,
      description: doc.description,
      path: doc.path
    }))
  }
})
