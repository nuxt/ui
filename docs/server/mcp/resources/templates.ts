export default defineMcpResource({
  uri: 'resource://nuxt-ui/templates',
  metadata: {
    description: 'Complete list of available Nuxt UI templates with categories'
  },
  handler: async (uri: URL) => {
    const result = await $fetch('/api/mcp/list-templates')
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(result, null, 2)
      }]
    }
  }
})
