import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves specific UI example implementation code and details',
  inputSchema: {
    exampleName: z.string().describe('The name of the example (PascalCase)')
  },
  cache: '30m',
  async handler({ exampleName }) {
    try {
      const result = await $fetch<{ code: string }>(`/api/component-example/${exampleName}.json`)
      return {
        content: [{ type: 'text' as const, text: result.code }]
      }
    } catch {
      return errorResult(`Example '${exampleName}' not found. Use the list_examples tool to see all available examples.`)
    }
  }
})
