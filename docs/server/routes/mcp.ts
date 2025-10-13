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

  // @ts-expect-error - Type instantiation is excessively deep and possibly infinite.
  server.registerPrompt(
    'find_component_for_usecase',
    {
      title: 'Find Component for Use Case',
      description: 'Find the best Nuxt UI component for a specific use case',
      argsSchema: {
        // need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
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
        // need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
        componentName: z.string().describe('The Nuxt UI component name (PascalCase)'),
        // need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
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
        // need to wait for support for zod 4, this works correctly just a type mismatch from zod 3 to zod 4 (https://github.com/modelcontextprotocol/typescript-sdk/pull/869)
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

  server.tool(
    'list_components',
    'Lists all available Nuxt UI components with their categories and basic information. Returns: A JSON array of objects containing name, title, description, path and category.',
    {},
    async () => {
      const result = await $fetch('/api/mcp/list-components')
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'list_composables',
    'Lists all available Nuxt UI composables with their categories and basic information. Returns: A JSON array of objects containing name, title, description and path.',
    {},
    async () => {
      const result = await $fetch('/api/mcp/list-composables')
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'get_component',
    'Retrieves Nuxt UI component documentation and details. Parameters: componentName (string, required) - the component name in PascalCase. Returns: A JSON object containing name, title, description, category, documentation, and documentation_url.',
    {
      componentName: z.string().describe('The name of the component (PascalCase)')
    },
    async (params) => {
      const result = await $fetch('/api/mcp/get-component', { query: params })
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'get_component_metadata',
    'Retrieves detailed metadata for a Nuxt UI component including props, slots, and events. Parameters: componentName (string, required) - the component name in PascalCase. Returns: A JSON object containing component metadata with pascalName, kebabName, props array, slots array, and emits array.',
    {
      componentName: z.string().describe('The name of the component (PascalCase)')
    },
    async (params) => {
      const result = await $fetch('/api/mcp/get-component-metadata', { query: params })
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'list_templates',
    'Lists all available Nuxt UI templates with optional category filtering. Parameters: category (string, optional) - filter by template category. Returns: A JSON object containing templates array, categories array, and total count.',
    {
      category: z.string().optional().describe('Filter templates by category')
    },
    async (params) => {
      const result = await $fetch('/api/mcp/list-templates', { query: params })
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'get_template',
    'Retrieves template details and setup instructions. Parameters: templateName (string, required) - the template name identifier. Returns: A JSON object containing name, description, setup_instructions, dependencies array, and optional preview_url and repository.',
    {
      templateName: z.string().describe('The name of the template')
    },
    async (params) => {
      const result = await $fetch('/api/mcp/get-template', { query: params })
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'get_documentation_page',
    'Retrieves documentation page content by URL path. Parameters: path (string, required) - the documentation path starting with /docs/. Returns: A JSON object containing title, content, path, url, and optional metadata.',
    {
      path: z.string().describe('The path to the content page (e.g., /docs/components/button)')
    },
    async (params) => {
      const result = await $fetch<string>(`/raw${params.path}.md`)
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'list_documentation_pages',
    'Lists all documentation pages. Returns: A JSON array of objects containing title, title, description, and path.',
    {},
    async () => {
      const result = await $fetch('/api/mcp/list-documentation-pages')
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'list_getting_started_guides',
    'Lists all getting started guides and installation instructions. Returns: A JSON object containing guides array, categories array, and total count.',
    {},
    async () => {
      const result = await $fetch('/api/mcp/list-getting-started-guides')
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'get_migration_guide',
    'Retrieves version-specific migration guides and upgrade instructions. Parameters: version (enum[v3,v4], required) - the migration version. Returns: A JSON object containing version, title, content, breaking_changes array, and migration_steps array.',
    {
      version: z.enum(['v3', 'v4']).describe('The migration version (e.g., v4, v3)')
    },
    async (params) => {
      const result = await $fetch('/api/mcp/get-migration-guide', { query: params })
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'list_examples',
    'Lists all available UI examples and code demonstrations. Returns: A JSON object containing examples array, categories array, and total count.',
    {},
    async () => {
      const result = await $fetch('/api/mcp/list-examples')
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'get_example',
    'Retrieves specific UI example implementation code and details. Parameters: exampleName (string, required) - the example name in PascalCase. Returns: A JSON object containing name, code, description, category, and optional dependencies array.',
    {
      exampleName: z.string().describe('The name of the example (PascalCase)')
    },
    async ({ exampleName }) => {
      const result = await $fetch(`/api/component-example/${exampleName}.json`)
      return { content: [{ type: 'text', text: result.code }] }
    }
  )

  server.tool(
    'search_components_by_category',
    'Searches components by category or text filter. Parameters: category (string, optional) - filter by category, search (string, optional) - search term for name/description. Returns: A JSON object containing filtered components array, total count, and applied filters.',
    {
      category: z.string().optional().describe('Filter components by category'),
      search: z.string().optional().describe('Search term to filter components by name or description')
    },
    async (params) => {
      const result = await $fetch('/api/mcp/search-components-by-category', { query: params })
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
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
