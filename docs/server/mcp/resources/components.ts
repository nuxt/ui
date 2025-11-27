export default defineMcpResource({
  uri: 'resource://nuxt-ui/components',
  description: 'Complete list of available Nuxt UI v4 components with metadata and categories',
  handler: async (uri: URL) => {
    const result = await $fetch('/api/mcp/list-components')
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(result, null, 2)
      }]
    }
  }
})
