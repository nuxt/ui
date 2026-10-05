// @ts-expect-error - no types available
import { listComponentExamples } from '#component-example/nitro'

export default defineMcpResource({
  uri: 'resource://nuxt-ui/examples',
  description: 'List of the available Nuxt UI example names. Names only, not code.',
  cache: '1h',
  handler(uri: URL) {
    return {
      contents: [{
        uri: uri.toString(),
        mimeType: 'application/json',
        text: JSON.stringify(listComponentExamples(), null, 2)
      }]
    }
  }
})
