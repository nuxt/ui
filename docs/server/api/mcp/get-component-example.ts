import { z } from 'zod'

const querySchema = z.object({
  componentName: z.string().describe('The name of the component (PascalCase)')
})

export default defineCachedEventHandler(async (event) => {
  const rawQuery = getQuery(event)
  const { componentName } = querySchema.parse(rawQuery)

  // Use PascalCase directly since component examples are stored by PascalCase
  return await $fetch(`/api/component-example/${componentName}.json`)
}, {
  name: 'mcp-get-component-example',
  maxAge: 1800 // 30 minutes
})
