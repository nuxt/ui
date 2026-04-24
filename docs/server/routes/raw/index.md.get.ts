import { queryCollection } from '@nuxt/content/server'
import { eventHandler, setHeader } from 'h3'

const DOMAIN = 'https://ui.nuxt.com'

export default eventHandler(async (event) => {
  const page = await queryCollection(event, 'index').first() as any

  const title = page?.title || 'Nuxt UI'
  const description = page?.description || 'A comprehensive Vue UI component library (Nuxt optional) with 125+ accessible, Tailwind CSS components for building modern web applications.'

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical_url: ${JSON.stringify(DOMAIN)}`,
    `last_updated: ${JSON.stringify(new Date().toISOString().split('T')[0])}`,
    '---',
    ''
  ].join('\n')

  const body = `# ${title}

> ${description}

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

- Nuxt: <${DOMAIN}/docs/getting-started/installation/nuxt.md>
- Vue: <${DOMAIN}/docs/getting-started/installation/vue.md>

## Explore

- Getting started: <${DOMAIN}/docs/getting-started.md>
- Components: <${DOMAIN}/docs/components.md>
- Composables: <${DOMAIN}/docs/composables/define-shortcuts.md>
- Typography: <${DOMAIN}/docs/typography.md>
- Sitemap: <${DOMAIN}/sitemap.md>
- LLMs index: <${DOMAIN}/llms.txt>
- Full LLMs documentation: <${DOMAIN}/llms-full.txt>

## Resources for Agents

- MCP Server Card: <${DOMAIN}/.well-known/mcp/server-card.json>
- MCP endpoint: <${DOMAIN}/mcp>
- API Catalog: <${DOMAIN}/.well-known/api-catalog>
- Agent Skill: <${DOMAIN}/.well-known/skills/nuxt-ui/SKILL.md>
- Skills index: <${DOMAIN}/.well-known/skills/index.json>

## Links

- Website: <${DOMAIN}>
- GitHub: <https://github.com/nuxt/ui>
- Discord: <https://discord.gg/ps2h6QT>
- X (Twitter): <https://x.com/nuxt_js>
`

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Link', `<${DOMAIN}>; rel="canonical"`)
  return frontmatter + body
})
