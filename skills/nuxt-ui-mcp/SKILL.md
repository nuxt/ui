---
name: Working with Nuxt UI Components
description: Implements Nuxt UI components using MCP tools that provide component documentation, props, slots, events, templates, and examples. Use when implementing Nuxt UI components, setting up Nuxt UI projects, searching for Vue components, or when user mentions Nuxt UI, nuxt-ui, UI components, Nuxt templates, or component APIs.
---

# Nuxt UI Component Development

Access Nuxt UI v4 documentation via MCP tools for components, templates, and examples.

## Quick Reference

**Component Lookup**
- Unknown component → `search_components_by_category(search="keyword")`
- Known component → `get_component(componentName="Button")`
- Need props/slots → `get_component_metadata(componentName="Button")`

**Project Setup**
- Browse templates → `list_templates()`
- Get template details → `get_template(templateName="dashboard")`

**Documentation**
- Installation → `get_documentation_page(path="/docs/getting-started/installation/nuxt")`
- Migration → `get_migration_guide(version="v4")`

## Component Workflows

### 1. Find Component by Purpose
```
User request: "component for login form"
→ search_components_by_category(search="form")
→ get_component_metadata for selected component
→ Implement with correct props
```

### 2. Implement Known Component
```
User request: "add Button with icon"
→ get_component_metadata(componentName="Button")
→ Verify icon prop/slot exists
→ Implement using metadata
```

### 3. Setup Project Template
```
User request: "create SaaS landing page"
→ list_templates() to verify "saas" exists
→ get_template(templateName="saas")
→ Follow setup instructions from template
```

## Tool Categories

### Component Tools
- `list_components`: All components with categories
- `search_components_by_category`: Search by keyword or category
- `get_component`: Full documentation (PascalCase required)
- `get_component_metadata`: Props, slots, events schema

### Template Tools
- `list_templates`: Available project templates
- `get_template`: Setup instructions for template

### Documentation Tools
- `list_documentation_pages`: All available docs
- `get_documentation_page`: Specific page (path: /docs/...)
- `list_getting_started_guides`: Installation guides
- `get_migration_guide`: Version migration (v3 or v4)

### Example & Composable Tools
- `list_examples`: All code examples
- `get_example`: Specific example code
- `list_composables`: Available Nuxt UI composables

## Naming Rules

- Components: PascalCase (Button, Input, Card)
- Docs paths: kebab-case (/docs/components/button)
- Templates: lowercase (dashboard, starter, saas)

## Data Source

All MCP tools prefix: `mcp__nuxt-ui-remote__`
Documentation source: https://ui.nuxt.com/mcp (Nuxt UI v4)