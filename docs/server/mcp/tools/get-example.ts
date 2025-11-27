import { z } from 'zod/v3'

export default defineMcpTool({
  description: 'Retrieves specific UI example implementation code and details',
  inputSchema: {
    exampleName: z.string().describe('The name of the example (PascalCase)')
  },
  handler: async ({ exampleName }) => {
    const result = await $fetch<{ code: string }>(`/api/component-example/${exampleName}.json`)
    return {
      content: [{ type: 'text' as const, text: result.code }]
    }
  }
})
