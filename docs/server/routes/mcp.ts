/***
 Workaround for using zod 3 for the mcp validation
 Read here: https://github.com/modelcontextprotocol/typescript-sdk/issues/906
 */
import { z } from 'zod/v3'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

function createServer() {
  const server = new McpServer({
    name: 'nuxt-ui',
    version: '1.0.0'
  })

  // RESOURCES

  server.registerResource(
    'nuxt-ui-documentation-pages',
    'resource://nuxt-ui/documentation-pages',
    {
      title: 'Nuxt UI Documentation Pages',
      description: 'Complete list of available Nuxt UI documentation pages'
    },
    async (uri) => {
      const result = await $fetch('/api/mcp/list-documentation-pages')
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(result, null, 2)
        }]
      }
    }
  )

  server.registerResource(
    'nuxt-ui-components',
    'resource://nuxt-ui/components',
    {
      title: 'Nuxt UI Components',
      description: 'Complete list of available Nuxt UI v4 components with metadata and categories'
    },
    async (uri) => {
      const result = await $fetch('/api/mcp/list-components')
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(result, null, 2)
        }]
      }
    }
  )

  server.registerResource(
    'nuxt-ui-composables',
    'resource://nuxt-ui/composables',
    {
      title: 'Nuxt UI Composables',
      description: 'Complete list of available Nuxt UI v4 composables with metadata and categories'
    },
    async (uri) => {
      const result = await $fetch('/api/mcp/list-composables')
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(result, null, 2)
        }]
      }
    }
  )

  server.registerResource(
    'nuxt-ui-examples',
    'resource://nuxt-ui/examples',
    {
      title: 'Nuxt UI Examples',
      description: 'Complete list of available Nuxt UI example code and demonstrations'
    },
    async (uri) => {
      const result = await $fetch('/api/mcp/list-examples')
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(result, null, 2)
        }]
      }
    }
  )

  server.registerResource(
    'nuxt-ui-templates',
    'resource://nuxt-ui/templates',
    {
      title: 'Nuxt UI Templates',
      description: 'Complete list of available Nuxt UI templates with categories'
    },
    async (uri) => {
      const result = await $fetch('/api/mcp/list-templates')
      return {
        contents: [{
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(result, null, 2)
        }]
      }
    }
  )

  // PROMPTS

  server.registerPrompt(
    'find_component_for_usecase',
    {
      title: 'Find Component for Use Case',
      description: 'Find the best Nuxt UI component for a specific use case',
      argsSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        usecase: z.string().describe('Describe what you want to build (e.g., "user login form", "data table", "navigation menu")')
      }
    },
    async ({ usecase }) => {
      const components = await $fetch('/api/mcp/list-components')
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Help me find the best Nuxt UI component for this use case: "${usecase}". Here are all available components: ${JSON.stringify(components, null, 2)}`
            }
          }
        ]
      }
    }
  )

  server.registerPrompt(
    'implement_component_with_props',
    {
      title: 'Implement Component with Props',
      description: 'Generate complete component implementation with proper props and styling',
      argsSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        componentName: z.string().describe('The Nuxt UI component name (PascalCase)'),
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        requirements: z.string().optional().describe('Specific requirements or customizations needed')
      }
    },
    async ({ componentName, requirements }) => {
      const component = await $fetch('/api/mcp/get-component', {
        query: { componentName, includeMetadata: true }
      })
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Generate a complete implementation of the ${componentName} component with proper props and styling. ${requirements ? `Requirements: ${requirements}` : ''}\n\nComponent details: ${JSON.stringify(component, null, 2)}`
            }
          }
        ]
      }
    }
  )

  server.registerPrompt(
    'setup_project_with_template',
    {
      title: 'Setup Project with Template',
      description: 'Guide through setting up a new project with a Nuxt UI template',
      argsSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        projectType: z.string().describe('Type of project (dashboard, landing page, admin panel, etc.)')
      }
    },
    async ({ projectType }) => {
      const templates = await $fetch('/api/mcp/list-templates')
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Guide me through setting up a new ${projectType} project with Nuxt UI. Here are available templates: ${JSON.stringify(templates, null, 2)}`
            }
          }
        ]
      }
    }
  )

  // TOOLS

  server.registerTool(
    'list_components',
    {
      title: 'List Components',
      description: 'Lists all available Nuxt UI components with their categories and basic information'
    },
    async () => {
      const result = await $fetch('/api/mcp/list-components')
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'list_composables',
    {
      title: 'List Composables',
      description: 'Lists all available Nuxt UI composables with their categories and basic information'
    },
    async () => {
      const result = await $fetch('/api/mcp/list-composables')
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'get_component',
    {
      title: 'Get Component',
      description: 'Retrieves Nuxt UI component documentation and details',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        componentName: z.string().describe('The name of the component (PascalCase)')
      }
    },
    async (params: { componentName: string }) => {
      const result = await $fetch('/api/mcp/get-component', { query: params })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'get_component_metadata',
    {
      title: 'Get Component Metadata',
      description: 'Retrieves detailed metadata for a Nuxt UI component including props, slots, and events',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        componentName: z.string().describe('The name of the component (PascalCase)')
      }
    },
    async (params: { componentName: string }) => {
      const result = await $fetch('/api/mcp/get-component-metadata', { query: params })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'list_templates',
    {
      title: 'List Templates',
      description: 'Lists all available Nuxt UI templates with optional category filtering',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        category: z.string().optional().describe('Filter templates by category')
      }
    },
    async (params: { category?: string }) => {
      const result = await $fetch('/api/mcp/list-templates', { query: params })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        structuredContent: result as any
      }
    }
  )

  server.registerTool(
    'get_template',
    {
      title: 'Get Template',
      description: 'Retrieves template details and setup instructions',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        templateName: z.string().describe('The name of the template')
      }
    },
    async (params: { templateName: string }) => {
      const result = await $fetch('/api/mcp/get-template', { query: params })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        structuredContent: result as any
      }
    }
  )

  server.registerTool(
    'get_documentation_page',
    {
      title: 'Get Documentation Page',
      description: 'Retrieves documentation page content by URL path',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        path: z.string().describe('The path to the content page (e.g., /docs/components/button)')
      }
    },
    async (params: { path: string }) => {
      const result = await $fetch<string>(`/raw${params.path}.md`)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'list_documentation_pages',
    {
      title: 'List Documentation Pages',
      description: 'Lists all documentation pages'
    },
    async () => {
      const result = await $fetch('/api/mcp/list-documentation-pages')
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'list_getting_started_guides',
    {
      title: 'List Getting Started Guides',
      description: 'Lists all getting started guides and installation instructions'
    },
    async () => {
      const result = await $fetch('/api/mcp/list-getting-started-guides')
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'get_migration_guide',
    {
      title: 'Get Migration Guide',
      description: 'Retrieves version-specific migration guides and upgrade instructions',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        version: z.enum(['v3', 'v4']).describe('The migration version (e.g., v4, v3)')
      }
    },
    async (params: { version: 'v3' | 'v4' }) => {
      const result = await $fetch('/api/mcp/get-migration-guide', { query: params })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'list_examples',
    {
      title: 'List Examples',
      description: 'Lists all available UI examples and code demonstrations'
    },
    async () => {
      const result = await $fetch('/api/mcp/list-examples')
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  server.registerTool(
    'get_example',
    {
      title: 'Get Example',
      description: 'Retrieves specific UI example implementation code and details',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        exampleName: z.string().describe('The name of the example (PascalCase)')
      }
    },
    async ({ exampleName }: { exampleName: string }) => {
      const result = await $fetch(`/api/component-example/${exampleName}.json`)
      return {
        content: [{ type: 'text' as const, text: result.code }]
      }
    }
  )

  server.registerTool(
    'search_components_by_category',
    {
      title: 'Search Components by Category',
      description: 'Searches components by category or text filter',
      inputSchema: {
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        category: z.string().optional().describe('Filter components by category'),
        // @ts-expect-error - need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        search: z.string().optional().describe('Search term to filter components by name or description')
      }
    },
    async (params: { category?: string, search?: string }) => {
      const result = await $fetch('/api/mcp/search-components-by-category', { query: params })
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }]
      }
    }
  )

  return server
}

export default defineEventHandler(async (event) => {
  if (getHeader(event, 'accept')?.includes('text/html')) {
    return sendRedirect(event, '/docs/getting-started/ai/mcp')
  }

  const server = createServer()

  const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  })

  event.node.res.on('close', () => {
    transport.close()
    server.close()
  })

  await server.connect(transport)

  const body = await readBody(event)

  await transport.handleRequest(event.node.req, event.node.res, body)
})
