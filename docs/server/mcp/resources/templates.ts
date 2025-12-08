import { queryCollection } from '@nuxt/content/server'

export default defineMcpResource({
  uri: 'resource://nuxt-ui/templates',
  description: 'Complete list of available Nuxt UI templates with categories',
  cache: '1h',
  async handler(uri: URL) {
    const event = useEvent()

    const templatesCollectionItems = await queryCollection(event, 'templates').first()

    const templateListing = templatesCollectionItems?.items || []

    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify({
          templates: templateListing,
          total: templateListing.length
        }, null, 2)
      }]
    }
  }
})
