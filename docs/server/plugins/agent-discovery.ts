import { queryCollection } from '@nuxt/content/server'
import { rawUrl } from '#agent-discovery'

/**
 * What `nuxt-agent-discovery` cannot know on its own.
 *
 * `agent-discovery:document` turns the MDC components in a documentation page
 * into plain markdown before the minimark tree is stringified for `/raw/**.md`,
 * which is where the raw route used to call `transformMDC()` itself.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('agent-discovery:document', async (event, page) => {
    await transformMDC(event, page as any)
  })

  // The homepage is a Vue page, so the module has no document to build
  // `/raw/index.md` from. Its metadata lives in the `index` collection and the
  // prose below is written for agents, which is everything this hook adds:
  // the frontmatter, the canonical links, the resources block and the trailer
  // all come from the module.
  nitroApp.hooks.hook('agent-discovery:index', async (event, index) => {
    const page = await queryCollection(event, 'index').first() as any

    index.title = page?.title || index.title
    index.description = page?.description

    index.body.push([
      renderLlmsSection(WHEN_TO_USE_SECTION, href => rawUrl(event, href)),
      `## About

Nuxt UI is a free and open source Vue UI library powered by [Reka UI](https://reka-ui.com/) and [Tailwind CSS](https://tailwindcss.com/). It works with both Nuxt and plain Vue applications.

- 125+ accessible, production-ready components
- Built on Reka UI (WAI-ARIA compliant primitives)
- Tailwind CSS theming with CSS variables and Tailwind Variants
- TypeScript support with full auto-completion
- Server-side rendering (SSR) compatible
- Dark mode support and 50+ languages via i18n
- Figma Kit included`,
      `## Installation

- Nuxt: <${SITE_URL}/raw/docs/getting-started/installation/nuxt.md>
- Vue: <${SITE_URL}/raw/docs/getting-started/installation/vue.md>`,
      `## Explore

- Documentation: <${SITE_URL}/docs>
- Components: <${SITE_URL}/raw/docs/components.md>
- Composables: <${SITE_URL}/raw/docs/composables/define-shortcuts.md>
- Typography: <${SITE_URL}/raw/docs/typography.md>`,
      `## Links

- Website: <${SITE_URL}>
- GitHub: <https://github.com/nuxt/ui>
- Discord: <https://discord.gg/ps2h6QT>
- X (Twitter): <https://x.com/nuxt_js>`
    ].join('\n\n'))
  })
})
