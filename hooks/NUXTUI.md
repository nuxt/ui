# Nuxt UI MCP Tools Usage Instructions

Always use Nuxt UI MCP tools when working with Nuxt UI components, templates, documentation, or examples.

## When to Use

- When the user asks about Nuxt UI components, their props, slots, or events
- When implementing Nuxt UI components in code
- When searching for the right component for a specific use case
- When setting up a new project with Nuxt UI templates
- When looking up Nuxt UI documentation or examples
- When migrating between Nuxt UI versions
- When exploring available composables

## Available MCP Tools

### Component Operations
- **mcp__nuxt-ui-remote__list_components**: Lists all available Nuxt UI components with categories
- **mcp__nuxt-ui-remote__get_component**: Gets detailed component documentation (requires componentName in PascalCase)
- **mcp__nuxt-ui-remote__get_component_metadata**: Gets component props, slots, and events metadata
- **mcp__nuxt-ui-remote__search_components_by_category**: Search components by category or text filter

### Template Management
- **mcp__nuxt-ui-remote__list_templates**: Lists all available project templates (Starter, Landing, Docs, SaaS, Dashboard, Chat, Portfolio, Changelog)
- **mcp__nuxt-ui-remote__get_template**: Gets template details and setup instructions

### Documentation Access
- **mcp__nuxt-ui-remote__list_documentation_pages**: Lists all documentation pages
- **mcp__nuxt-ui-remote__get_documentation_page**: Gets specific documentation page content (requires path starting with /docs/)
- **mcp__nuxt-ui-remote__list_getting_started_guides**: Lists installation and getting started guides
- **mcp__nuxt-ui-remote__get_migration_guide**: Gets version-specific migration guides (v3 or v4)

### Examples & Composables
- **mcp__nuxt-ui-remote__list_examples**: Lists all UI examples and code demonstrations
- **mcp__nuxt-ui-remote__get_example**: Gets specific example implementation code
- **mcp__nuxt-ui-remote__list_composables**: Lists all available Nuxt UI composables

## Usage Examples

### Finding the Right Component
When user asks "What component should I use for a login form?":
1. Use `mcp__nuxt-ui-remote__search_components_by_category` with search="form"
2. Or use `mcp__nuxt-ui-remote__list_components` to browse all components

### Implementing a Component
When user asks "How do I use the Button component?":
1. Use `mcp__nuxt-ui-remote__get_component` with componentName="Button"
2. Use `mcp__nuxt-ui-remote__get_component_metadata` with componentName="Button" for props/slots/events

### Setting Up a Project
When user asks "How do I create a dashboard with Nuxt UI?":
1. Use `mcp__nuxt-ui-remote__list_templates` to see available templates
2. Use `mcp__nuxt-ui-remote__get_template` with templateName="dashboard"

### Getting Documentation
When user asks "How do I install Nuxt UI?":
1. Use `mcp__nuxt-ui-remote__list_getting_started_guides`
2. Use `mcp__nuxt-ui-remote__get_documentation_page` with path="/docs/getting-started/installation/nuxt"

## Best Practices

1. **Always fetch component metadata** before implementing complex components
2. **Use search tools** when the exact component name is unknown
3. **Check examples** for implementation patterns and best practices
4. **Reference templates** when starting new projects
5. **Consult migration guides** when upgrading Nuxt UI versions

## Component Naming Convention

- Always use **PascalCase** for component names (e.g., "Button", "Input", "Card")
- Documentation paths use **kebab-case** (e.g., "/docs/components/button")

## Note

These tools connect to the live Nuxt UI documentation at https://ui.nuxt.com/mcp and provide up-to-date information about Nuxt UI v4.
