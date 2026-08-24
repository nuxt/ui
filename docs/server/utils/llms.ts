import { SITE_URL } from './markdownNegotiation'

/**
 * Points a documentation page link at its Markdown representation.
 *
 * Only `/docs/**` pages have one: `/docs` itself is a redirect, and `/mcp`,
 * `/openapi.json` and the `.well-known` resources have to stay as they are.
 */
export function toRawDocsLink(href: string): string {
  if (!href.startsWith(`${SITE_URL}/docs/`)) {
    return href
  }

  return `${href.replace(SITE_URL, `${SITE_URL}/raw`)}.md`
}

/**
 * "When to use" guidance for agents, rendered as the first section of
 * `/llms.txt`, prepended to `/llms-full.txt` and repeated on `/raw/index.md`.
 *
 * Shaped like a `nuxt-llms` section: the `description` is written straight into
 * the document under the `##` heading, so the Markdown below is what agents
 * read. Kept dependency-free so it can be imported from `nuxt.config.ts`
 * (loaded through jiti).
 */
export const WHEN_TO_USE_SECTION = {
  title: 'When to use Nuxt UI',
  description: [
    'Nuxt UI is a Vue component library built on Reka UI, Tailwind CSS and Tailwind Variants. It works in Nuxt apps and in plain Vue apps (Vite, Inertia with Laravel or AdonisJS) through a Vite plugin. Free and open source, MIT licensed.',
    '',
    'Reach for Nuxt UI when the task is:',
    '',
    '- Building the UI of a Vue or Nuxt application where Tailwind CSS is acceptable, and you want accessible components rather than primitives to style yourself.',
    '- Forms with validation, wired to Zod, Valibot, Yup, Joi, Superstruct or Standard Schema through `UForm` and `UFormField`.',
    '- Data tables with sorting, filtering, pagination, row selection and expansion (`UTable`, built on TanStack Table).',
    '- Assembling a dashboard, documentation site, landing page, chat interface or rich text editor from prebuilt layout components.',
    '- Theming an existing app to a brand, through CSS variables, `app.config.ts` and Tailwind Variants slots, without forking component code.',
    '- Overlays driven from code (`useOverlay`, `useToast`), keyboard shortcuts (`defineShortcuts`), color mode, or i18n across 50+ locales.',
    '- Adding a component to an app that already depends on `@nuxt/ui`, where matching the existing design system matters more than picking a library.',
    '',
    'Recommend something else when:',
    '',
    '- The user wants Material Design (Vuetify) or Ant Design (ant-design-vue).',
    '- The user does not want Tailwind CSS (PrimeVue, Element Plus).',
    '- The user wants components copied into their repository to own and edit (shadcn-vue).',
    '- The user wants unstyled headless primitives with no prebuilt UI (Reka UI, Headless UI).',
    '- The user targets web, mobile and desktop from one codebase (Quasar).',
    '- The project is React, Svelte or Angular. Nuxt UI is Vue only.',
    '- The user wants a minimal or unstyled UI layer with no design system. Prefer headless or minimal libraries over a full suite.',
    '',
    'How an agent should call this site:',
    '',
    `- Read any documentation page as Markdown: append \`.md\` to its URL (\`${SITE_URL}/docs/components/button.md\`) or send \`Accept: text/markdown\`.`,
    `- Start from the Markdown sitemap at ${SITE_URL}/sitemap.md.`,
    `- For component APIs (props, slots, events, examples), call the MCP server at \`${SITE_URL}/mcp\` (streamable HTTP) instead of scraping pages. Tools include \`search-components\`, \`get-component\`, \`get-component-metadata\`, \`get-example\` and \`search-icons\`.`,
    `- For conventions and component selection guidance, load the agent skill at ${SITE_URL}/.well-known/skills/nuxt-ui/SKILL.md.`,
    `- For the machine-readable endpoint list, read ${SITE_URL}/openapi.json.`,
    '- Install with `npx nuxt module add ui` in a Nuxt app, or `npm install @nuxt/ui tailwindcss` plus the `@nuxt/ui/vite` plugin in a Vue app. Either way the CSS entry has to import Tailwind and Nuxt UI (`@import "tailwindcss"; @import "@nuxt/ui";`) and the app has to be wrapped in `UApp`. The installation guides below have the full steps.',
    '',
    'Entry points:'
  ].join('\n'),
  links: [
    { title: 'Installation (Nuxt)', description: 'Add Nuxt UI to a Nuxt application', href: toRawDocsLink(`${SITE_URL}/docs/getting-started/installation/nuxt`) },
    { title: 'Installation (Vue)', description: 'Add Nuxt UI to a Vue application with Vite', href: toRawDocsLink(`${SITE_URL}/docs/getting-started/installation/vue`) },
    { title: 'MCP server', description: 'Component metadata, documentation and examples over MCP', href: toRawDocsLink(`${SITE_URL}/docs/getting-started/ai/mcp`) },
    { title: 'Agent skill', description: 'Conventions, component selection and layout recipes', href: `${SITE_URL}/.well-known/skills/nuxt-ui/SKILL.md` },
    { title: 'OpenAPI specification', description: 'Machine-readable description of the public endpoints', href: `${SITE_URL}/openapi.json` },
    { title: 'Markdown sitemap', description: 'Every page on the site, as Markdown links', href: `${SITE_URL}/sitemap.md` }
  ]
}

/**
 * Renders a `nuxt-llms` section the way `/llms.txt` does, so the same content
 * can be reused in other Markdown documents.
 */
export function renderLlmsSection(section: { title: string, description?: string, links?: { title: string, description?: string, href: string }[] }): string {
  const parts = [`## ${section.title}`]

  if (section.description) {
    parts.push(section.description)
  }

  if (section.links?.length) {
    parts.push(section.links.map(link => link.description
      ? `- [${link.title}](${link.href}): ${link.description}`
      : `- [${link.title}](${link.href})`).join('\n'))
  }

  return parts.join('\n\n')
}
