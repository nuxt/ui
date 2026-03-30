import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Lists all available Nuxt UI components with their categories and basic information',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  cache: '1h',
  async handler() {
    const event = useEvent()
    const components = await queryCollection(event, 'docs')
      .where('path', 'LIKE', '%/components/%')
      .where('extension', '=', 'md')
      .select('path', 'title', 'description', 'category')
      .all()

    return components
  }
})
