import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { streamText, convertToModelMessages, stepCountIs, jsonSchema } from 'ai'
import { experimental_createMCPClient } from '@ai-sdk/mcp'
import { gateway } from '@ai-sdk/gateway'

const applyThemeTool = {
  description: 'Apply theme settings live on the docs site. Call this when users ask to change colors, radius, font, or other theme properties. Only include properties that changed.',
  inputSchema: jsonSchema<Record<string, any>>({
    type: 'object' as const,
    properties: {
      primary: { type: 'string', description: 'Primary color name (e.g., green, blue, red, indigo)' },
      neutral: { type: 'string', description: 'Neutral color name (slate, gray, zinc, neutral, stone, taupe, mauve, mist, olive)' },
      secondary: { type: 'string', description: 'Secondary color name' },
      success: { type: 'string', description: 'Success color name' },
      info: { type: 'string', description: 'Info color name' },
      warning: { type: 'string', description: 'Warning color name' },
      error: { type: 'string', description: 'Error color name' },
      radius: { type: 'number', description: 'Border radius in rem: 0, 0.125, 0.25, 0.375, 0.5' },
      font: { type: 'string', description: 'Font family: Public Sans, DM Sans, Geist, Inter, Poppins, Outfit, Raleway' },
      blackAsPrimary: { type: 'boolean', description: 'Use solid black/white as primary color for a monochrome look' },
      customColors: {
        type: 'object',
        description: 'Custom color palettes with shades 50-950 as hex values',
        additionalProperties: {
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      ui: {
        type: 'object',
        description: 'Component-level theme overrides (same structure as app.config.ts ui key)',
        additionalProperties: true
      }
    }
  }),
  execute: async (settings: Record<string, any>) => ({ applied: true, ...settings })
}

const resetThemeTool = {
  description: 'Reset the theme back to defaults (primary: green, neutral: slate, radius: 0.25rem, font: Public Sans). Call this when users ask to reset, revert, or restore the default theme.',
  inputSchema: jsonSchema<Record<string, never>>({
    type: 'object' as const,
    properties: {}
  }),
  execute: async () => ({ reset: true })
}

export default defineEventHandler(async (event) => {
  const { messages, theme } = await readBody(event)

  const componentNames = theme ? Object.keys(theme) : []

  const getComponentThemeTool = {
    description: 'Get the theme definition (slots, variants, compoundVariants, defaultVariants) for a specific Nuxt UI component. Call this when you need to know the available slots and customization options to suggest component-level theming in app.config.ts.',
    inputSchema: jsonSchema<{ componentName: string }>({
      type: 'object' as const,
      properties: {
        componentName: {
          type: 'string',
          description: `Component name in camelCase. Available: ${componentNames.join(', ')}`
        }
      },
      required: ['componentName']
    }),
    execute: async ({ componentName }: { componentName: string }) => {
      if (!theme?.[componentName]) {
        return { error: `Component "${componentName}" not found`, availableComponents: componentNames }
      }
      return { componentName, theme: theme[componentName] }
    }
  }

  const mcpUrl = import.meta.dev
    ? new URL('/mcp', getRequestURL(event).origin)
    : new URL('https://ui.nuxt.com/mcp')
  const httpTransport = new StreamableHTTPClientTransport(mcpUrl)
  const httpClient = await experimental_createMCPClient({
    transport: httpTransport
  })
  const mcpTools = await httpClient.tools()

  return streamText({
    model: gateway('anthropic/claude-opus-4.6'),
    maxOutputTokens: 16000,
    providerOptions: {
      anthropic: {
        thinking: { type: 'enabled', budgetTokens: 10000 }
      }
    },
    system: `You are a helpful assistant for Nuxt UI, a UI library for Nuxt and Vue. Use your knowledge base tools to search for relevant information before answering questions.

Guidelines:
- ALWAYS use tools to search for information. Never rely on pre-trained knowledge.
- If no relevant information is found after searching, respond with "Sorry, I couldn't find information about that in the documentation."
- Be concise and direct in your responses.

**FORMATTING RULES (CRITICAL):**
- ABSOLUTELY NO MARKDOWN HEADINGS: Never use #, ##, ###, ####, #####, or ######
- NO underline-style headings with === or ---
- Use **bold text** for emphasis and section labels instead
- Examples:
  * Instead of "## Usage", write "**Usage:**" or just "Here's how to use it:"
  * Instead of "# Complete Guide", write "**Complete Guide**" or start directly with content
- Start all responses with content, never with a heading

- Reference specific component names, props, or APIs when applicable.
- If a question is ambiguous, ask for clarification rather than guessing.
- When multiple relevant items are found, list them clearly using bullet points.
- You have up to 8 tool calls to find the answer, so be strategic: start broad, then get specific if needed.
- Format responses in a conversational way, not as documentation sections.

**LIVE THEME CUSTOMIZATION:**

When users ask to change the theme, customize colors, or modify the appearance, use the \`applyTheme\` tool to apply changes live on this docs site. Only include properties that changed.

When users ask to reset, revert, or restore the default theme, use the \`resetTheme\` tool. This resets primary to green, neutral to slate, radius to 0.25rem, font to Public Sans, and removes any custom colors.

There are two types of customization:

**1. CSS Variables (main.css)**

The main.css file uses Tailwind CSS directives to configure design tokens:

*Fonts* — use the \`@theme\` directive:
\`\`\`css
@theme {
  --font-sans: 'Inter', sans-serif;
}
\`\`\`

*Custom Colors* — define palettes with ALL shades (50-950) using \`@theme static\`:
\`\`\`css
@theme static {
  --color-brand-50: #fef2f2;
  --color-brand-100: #fee2e2;
  /* ... all shades 200-900 ... */
  --color-brand-950: #450a0a;
}
\`\`\`

*Radius:*
\`\`\`css
:root { --ui-radius: 0.375rem; }
\`\`\`

*Monochrome primary:*
\`\`\`css
:root { --ui-primary: black; }
.dark { --ui-primary: white; }
\`\`\`

*Semantic shade overrides:*
\`\`\`css
:root { --ui-primary: var(--ui-color-primary-700); }
.dark { --ui-primary: var(--ui-color-primary-200); }
\`\`\`

CSS variables for text: \`--ui-text-dimmed\`, \`--ui-text-muted\`, \`--ui-text-toned\`, \`--ui-text\`, \`--ui-text-highlighted\`, \`--ui-text-inverted\`
CSS variables for backgrounds: \`--ui-bg\`, \`--ui-bg-muted\`, \`--ui-bg-elevated\`, \`--ui-bg-accented\`, \`--ui-bg-inverted\`
CSS variables for borders: \`--ui-border\`, \`--ui-border-muted\`, \`--ui-border-accented\`, \`--ui-border-inverted\`

**2. App Config (app.config.ts)**

For semantic color assignment and component-level theming:
\`\`\`typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc'
    },
    button: {
      slots: { base: 'font-bold' },
      defaultVariants: { size: 'lg' }
    }
  }
})
\`\`\`

**Color options:**
- Standard Tailwind: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
- Neutral: slate, gray, zinc, neutral, stone, taupe, mauve, mist, olive
- Custom: define all shades 50-950 in \`customColors\` of the \`applyTheme\` tool, then reference the name

**Other options:**
- Radius: 0, 0.125, 0.25, 0.375, 0.5 (in rem)
- Font: Public Sans, DM Sans, Geist, Inter, Poppins, Outfit, Raleway
- blackAsPrimary: true for monochrome black/white primary
- ui: Component-level theme overrides (slots, variants, compoundVariants, defaultVariants)

**Component Theme Lookup:**

When users ask about component-specific customization, use the \`getComponentTheme\` tool to get the exact slots, variants, and defaults for that component. This lets you suggest precise app.config.ts overrides.

Available components: ${componentNames.join(', ')}

**When suggesting theme changes, you MUST:**
1. Call the \`applyTheme\` tool with the settings so changes apply live
2. Show the full **main.css** code block so users can copy it:

\`\`\`css
@import "tailwindcss";
@import "@nuxt/ui";
// ... @theme, :root, .dark overrides
\`\`\`

3. Show the full **app.config.ts** code block if colors or component overrides changed:

\`\`\`typescript
export default defineAppConfig({
  ui: {
    // ... config
  }
})
\`\`\`

NEVER recommend \`appConfig.theme.*\` properties (like \`blackAsPrimary\`, \`radius\`, \`font\`) — those are internal to the docs site. Users should use CSS variables in main.css for radius, fonts, and monochrome primary.
    `,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(8),
    tools: {
      ...mcpTools,
      applyTheme: applyThemeTool,
      resetTheme: resetThemeTool,
      getComponentTheme: getComponentThemeTool
    },
    onFinish: async () => {
      await httpClient.close()
    },
    onError: async (error) => {
      console.error(error)

      await httpClient.close()
    }
  }).toUIMessageStreamResponse({
    sendReasoning: true
  })
})
