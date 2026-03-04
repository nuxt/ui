// @ts-expect-error - no types available
import { listComponentExamples } from '#component-example/nitro'

export default defineMcpTool({
  description: 'Lists all available UI examples and code demonstrations',
  cache: '1h',
  handler() {
    return jsonResult(listComponentExamples())
  }
})
