export default defineMcpResource({
  uri: 'resource://nuxt-ui/composables',
  description: 'Complete list of available Nuxt UI v4 composables with metadata and categories',
  handler: async (uri: URL) => {
    const result = await $fetch('/api/mcp/list-composables')
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(result, null, 2)
      }]
    }
  }
})
