// @ts-expect-error - no types available
import { listComponentExamples } from '#component-example/nitro'

export default defineMcpTool({
  description: 'Lists the names of all available UI examples. Returns names only, not code: pass a name to `get-example` to read its source.',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  cache: '1h',
  handler() {
    return listComponentExamples()
  }
})
