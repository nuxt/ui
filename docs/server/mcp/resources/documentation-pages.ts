export default defineMcpResource({
  uri: 'resource://nuxt-ui/documentation-pages',
  description: 'Complete list of available Nuxt UI documentation pages',
  handler: async (uri: URL) => {
    const result = await $fetch('/api/mcp/list-documentation-pages')
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(result, null, 2)
      }]
    }
  }
})
