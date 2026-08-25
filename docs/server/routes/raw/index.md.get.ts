import { queryCollection } from '@nuxt/content/server'
import { rawUrl, renderAgentResources } from '#agent-discovery'

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

${renderLlmsSection(WHEN_TO_USE_SECTION, href => rawUrl(event, href))}

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

${renderAgentResources(event)}
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
