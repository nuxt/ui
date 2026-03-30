import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves specific UI example implementation code and details',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  },
  inputSchema: {
    exampleName: z.string().describe('The name of the example (PascalCase)')
  },
  inputExamples: [
    { exampleName: 'ButtonBasic' },
    { exampleName: 'ModalOverlay' }
  ],
  cache: '30m',
  async handler({ exampleName }) {
    let result
    try {
      result = await $fetch<{ code: string }>(`/api/component-example/${exampleName}.json`)
    } catch {
      throw createError({ statusCode: 404, message: `Example '${exampleName}' not found. Use the list_examples tool to see all available examples.` })
    }

    return result.code
  }
})
