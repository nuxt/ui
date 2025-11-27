export default defineMcpResource({
  uri: 'resource://nuxt-ui/examples',
  metadata: {
    description: 'Complete list of available Nuxt UI example code and demonstrations'
  },
  handler: async (uri: URL) => {
    const result = await $fetch('/api/mcp/list-examples')
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(result, null, 2)
      }]
    }
  }
})
