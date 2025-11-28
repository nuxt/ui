// @ts-expect-error - no types available
import components from '#component-example/nitro'

export default defineMcpTool({
  description: 'Lists all available UI examples and code demonstrations',
  cache: '1h',
  handler() {
    const examples = Object.entries<{ pascalName: string }>(components).map(([_key, value]) => {
      return value.pascalName
    })

    return jsonResult(examples)
  }
})
