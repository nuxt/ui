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
    try {
      const result = await $fetch<{ code: string }>(`/api/component-example/${exampleName}.json`)
      return result.code
    } catch (error: unknown) {
      const err = error as { statusCode?: number, response?: { status?: number } }
      const status = err?.statusCode ?? err?.response?.status
      if (status === 404) {
        throw createError({ statusCode: 404, message: `Example '${exampleName}' not found. Use the list_examples tool to see all available examples.` })
      }
      throw error
    }
  }
})
