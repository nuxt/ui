import { queryCollection } from '@nuxt/content/server'

export default defineMcpTool({
  description: 'Lists all documentation pages',
  cache: '1h',
  async handler() {
    const event = useEvent()

    const pages = await queryCollection(event, 'docs').all()

    return jsonResult(pages.map(doc => ({
      title: doc.title,
      description: doc.description,
      path: doc.path
    })))
  }
})
