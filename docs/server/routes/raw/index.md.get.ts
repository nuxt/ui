import { queryCollection } from '@nuxt/content/server'

// Prerendered from `app/pages/index.vue`, so the response is never computed
// at runtime in production. It used to be a `defineCachedEventHandler` with
// `swr`, which hands the prerenderer the previous build's cached body when the
// build cache survives between builds.
export default defineEventHandler(async (event) => {
  const page = await queryCollection(event, 'index').first() as any

  const title = page?.title || 'Nuxt UI'
  const description = page?.description || 'A comprehensive Vue UI component library (Nuxt optional) with 125+ accessible, Tailwind CSS components for building modern web applications.'

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical_url: ${JSON.stringify(SITE_URL)}`,
    '---',
    '\n'
  ].join('\n')

  const body = `# ${title}

${description}

${renderLlmsSection(WHEN_TO_USE_SECTION)}

## About

Nuxt UI is a free and open source Vue UI library powered by [Reka UI](https://reka-ui.com/) and [Tailwind CSS](https://tailwindcss.com/). It works with both Nuxt and plain Vue applications.

- 125+ accessible, production-ready components
- Built on Reka UI (WAI-ARIA compliant primitives)
- Tailwind CSS theming with CSS variables and Tailwind Variants
- TypeScript support with full auto-completion
- Server-side rendering (SSR) compatible
- Dark mode support and 50+ languages via i18n
- Figma Kit included

## Installation

- Nuxt: <${SITE_URL}/raw/docs/getting-started/installation/nuxt.md>
- Vue: <${SITE_URL}/raw/docs/getting-started/installation/vue.md>

## Explore

- Documentation: <${SITE_URL}/docs>
- Components: <${SITE_URL}/raw/docs/components.md>
- Composables: <${SITE_URL}/raw/docs/composables/define-shortcuts.md>
- Typography: <${SITE_URL}/raw/docs/typography.md>
- Sitemap (XML): <${SITE_URL}/sitemap.xml>
- Sitemap (Markdown): <${SITE_URL}/sitemap.md>
- LLMs index: <${SITE_URL}/llms.txt>
- Full LLMs documentation: <${SITE_URL}/llms-full.txt>

## Resources for Agents

- MCP Server Card: <${SITE_URL}/.well-known/mcp/server-card.json>
- MCP endpoint: <${SITE_URL}/mcp>
- API Catalog: <${SITE_URL}/.well-known/api-catalog>
- OpenAPI specification: <${SITE_URL}/openapi.json>
- Agent Skill: <${SITE_URL}/.well-known/skills/nuxt-ui/SKILL.md>
- Skills index: <${SITE_URL}/.well-known/skills/index.json>

## Links

- Website: <${SITE_URL}>
- GitHub: <https://github.com/nuxt/ui>
- Discord: <https://discord.gg/ps2h6QT>
- X (Twitter): <https://x.com/nuxt_js>
`

  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setResponseHeader(event, 'Link', [
    `<${SITE_URL}>; rel="canonical"`,
    `<${SITE_URL}>; rel="alternate"; type="text/html"`
  ].join(', '))
  return frontmatter + body
})
