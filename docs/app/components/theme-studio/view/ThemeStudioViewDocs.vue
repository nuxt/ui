<script setup lang="ts">
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'
import type { ContentNavigationLink, ContentSurroundLink, DropdownMenuItem, PageLink } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

// Left aside. UContentNavigation is prop-driven, not content-coupled: it reads
// `title`, and `active` forces the state without a route, so the tree is a
// static array. Paths are empty so nothing navigates out of the studio: the
// type wants the key, and both the mapper and ULink drop a falsy one.
const navLinks: ContentNavigationLink[] = [{
  path: '',
  title: 'Getting Started',
  children: [
    { path: '', title: 'Introduction', icon: studioIcons.home },
    { path: '', title: 'Installation', icon: studioIcons.download },
    { path: '', title: 'Usage', icon: studioIcons.settings, active: true }
  ]
}, {
  path: '',
  title: 'Essentials',
  children: [
    { path: '', title: 'Markdown Syntax', icon: studioIcons.heading },
    { path: '', title: 'Code Blocks', icon: studioIcons.code },
    { path: '', title: 'Prose Components', icon: studioIcons.component },
    { path: '', title: 'Images and Embeds', icon: studioIcons.image }
  ]
}, {
  path: '',
  title: 'AI',
  children: [
    { path: '', title: 'MCP Server', icon: studioIcons.cpu },
    { path: '', title: 'LLMs Integration', icon: appConfig.ui.icons.file }
  ]
}]

// The template's prev/next pair, inert for the same reason.
const surround: ContentSurroundLink[] = [{
  path: '',
  class: 'text-start',
  title: 'Installation',
  description: 'Get started with the documentation template in a few steps.'
}, {
  path: '',
  title: 'Markdown Syntax',
  description: 'Headings, lists, links and everything Markdown supports.'
}]

// PageHeaderLinks dropdown, minus the real clipboard / external navigations.
const copyItems: DropdownMenuItem[] = [
  { label: 'Copy Markdown link', icon: studioIcons.link },
  { label: 'View as Markdown', icon: 'i-simple-icons:markdown' },
  { label: 'Open in ChatGPT', icon: 'i-simple-icons:openai' },
  { label: 'Open in Claude', icon: 'i-simple-icons:anthropic' }
]

// Right column: UContentToc is content-coupled and router-driven, so the
// same sticky layout is hand-rolled with faked active states.
const tocLinks = [
  { label: 'Writing content', active: true },
  {
    label: 'App Configuration',
    children: [
      { label: 'Header' },
      { label: 'Footer' },
      { label: 'Table of contents' }
    ]
  }
]

const communityLinks: PageLink[] = [
  { label: 'Edit this page', icon: appConfig.ui.icons.external },
  { label: 'Star on GitHub', icon: appConfig.ui.icons.star },
  { label: 'Nuxt UI docs', icon: studioIcons.bookOpen }
]

/**
 * The template's `content/1.getting-started/3.usage.md`, verbatim. It renders
 * through ContentRenderer there and through Comark here, both of which map
 * markdown onto the same Prose components, so the callout props, the code
 * block filenames and the heading ids all come out of the markdown itself.
 */
const content = `This is only a basic example of what you can achieve with [Nuxt UI](https://ui.nuxt.com), you can tweak it to match your needs. The template uses several Nuxt modules underneath like [\`@nuxt/content\`](https://content.nuxt.com) for the content and [\`nuxt-og-image\`](https://nuxtseo.com/og-image/getting-started/installation) for social previews.

::tip
---
target: _blank
to: https://ui.nuxt.com/getting-started/installation
---
Learn more on how to take the most out of Nuxt UI!
::

## Writing content

You can just start writing \`.md\` or \`.yml\` files in the [\`content/\`](https://content.nuxt.com/usage/content-directory) directory to have your pages updated. The navigation will be automatically generated in the left aside and in the mobile menu. You will also be able to go through your content with full-text search.

## App Configuration

In addition to \`@nuxt/ui\` configuration through the \`app.config.ts\`, this template lets you customize the \`Header\`, \`Footer\` and the \`Table of contents\` components.

### Header

\`\`\`ts [app.config.ts]
export default defineAppConfig({
  header: {
    title: '',
    to: '/',
    // Logo configuration
    logo: {
      alt: '',
      // Light mode
      light: '',
      // Dark mode
      dark: ''
    },
    // Show or hide the search bar
    search: true,
    // Show or hide the color mode button
    colorMode: true,
    // Customize links
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt-ui-templates/docs',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  },
})
\`\`\`

### Footer

\`\`\`ts [app.config.ts]
export default defineAppConfig({
  footer: {
    // Update bottom left credits
    credits: \`Built with Nuxt UI • © \${new Date().getFullYear()}\`,
    // Show or hide the color mode button
    colorMode: false,
    // Customize links
    links: [{
      'icon': 'i-simple-icons-discord',
      'to': 'https://go.nuxt.com/discord',
      'target': '_blank',
      'aria-label': 'Nuxt on Discord'
    }, {
      'icon': 'i-simple-icons-x',
      'to': 'https://go.nuxt.com/x',
      'target': '_blank',
      'aria-label': 'Nuxt on X'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt/ui',
      'target': '_blank',
      'aria-label': 'Nuxt UI on GitHub'
    }]
  },
})
\`\`\`

### Table of contents

\`\`\`ts [app.config.ts]
export default defineAppConfig({
  toc: {
    // Title of the main table of contents
    title: 'Table of Contents',
    // Customize links
    bottom: {
      // Title of the bottom table of contents
      title: 'Community',
      // URL of your repository content folder
      edit: 'https://github.com/nuxt-ui-pro/docs/edit/main/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/nuxt/ui',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Nuxt UI docs',
        to: 'https://ui.nuxt.com/getting-started/installation',
        target: '_blank'
      }]
    }
  }
})
\`\`\``
</script>

<template>
  <!-- The pane is the scroll container, so the header and asides stick to it. -->
  <div class="h-full overflow-y-auto bg-default">
    <UHeader :toggle="false" class="rounded-t-[inherit]" :ui="{ center: 'flex-1' }">
      <template #left>
        <div class="flex items-center gap-1.5">
          <UIcon :name="studioIcons.bookOpen" class="size-6 text-primary shrink-0" />
          <span class="text-xl font-bold text-highlighted">Docs</span>
        </div>
      </template>

      <!-- UContentSearchButton opens the content search modal: fake the expanded look. -->
      <UButton
        :icon="appConfig.ui.icons.search"
        label="Search documentation..."
        color="neutral"
        variant="outline"
        class="w-full"
        :ui="{ base: 'text-dimmed hover:text-default font-normal', leadingIcon: 'size-4' }"
      >
        <template #trailing>
          <div class="ms-auto hidden lg:flex items-center gap-0.5">
            <UKbd value="meta" />
            <UKbd value="K" />
          </div>
        </template>
      </UButton>

      <template #right>
        <!-- UColorModeButton renders the pack's moon/sun pair; the studio toolbar owns the real toggle. -->
        <UButton color="neutral" variant="ghost" aria-label="Color mode">
          <template #leading="{ ui }">
            <UIcon :name="appConfig.ui.icons.dark" :class="ui.leadingIcon({ class: 'hidden dark:inline-block' })" />
            <UIcon :name="appConfig.ui.icons.light" :class="ui.leadingIcon({ class: 'dark:hidden' })" />
          </template>
        </UButton>
        <UButton :icon="studioIcons.github" aria-label="GitHub" color="neutral" variant="ghost" />
      </template>
    </UHeader>

    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation highlight :navigation="navLinks" />
          </UPageAside>
        </template>

        <UPage>
          <UPageHeader
            headline="Getting Started"
            title="Usage"
            description="Learn how to write and customize your documentation."
          >
            <template #links>
              <UFieldGroup>
                <UButton
                  label="Copy page"
                  :icon="appConfig.ui.icons.copy"
                  color="neutral"
                  variant="outline"
                  :ui="{ leadingIcon: 'text-neutral size-3.5' }"
                />
                <UDropdownMenu
                  :items="copyItems"
                  :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
                  :ui="{ content: 'w-48' }"
                >
                  <UButton
                    :icon="appConfig.ui.icons.chevronDown"
                    size="sm"
                    color="neutral"
                    variant="outline"
                    aria-label="Open copy actions menu"
                  />
                </UDropdownMenu>
              </UFieldGroup>
            </template>
          </UPageHeader>

          <UPageBody>
            <Markdown :value="content" :plugins="[shiki()]" />

            <USeparator />

            <UContentSurround :surround="surround" />
          </UPageBody>

          <template #right>
            <div class="hidden lg:flex flex-col gap-6 self-start sticky top-(--ui-header-height) py-8">
              <div>
                <p class="text-sm font-semibold text-highlighted mb-1.5">
                  Table of Contents
                </p>

                <ul class="min-w-0">
                  <li v-for="link in tocLinks" :key="link.label" class="min-w-0">
                    <button
                      type="button"
                      class="w-full text-start text-sm py-1 truncate transition-colors"
                      :class="link.active ? 'text-primary' : 'text-muted hover:text-default'"
                    >
                      {{ link.label }}
                    </button>

                    <ul v-if="link.children" class="ms-3 min-w-0">
                      <li v-for="child in link.children" :key="child.label" class="min-w-0">
                        <button
                          type="button"
                          class="w-full text-start text-sm py-1 truncate text-muted hover:text-default transition-colors"
                        >
                          {{ child.label }}
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <USeparator type="dashed" />

              <UPageLinks title="Community" :links="communityLinks" />
            </div>
          </template>
        </UPage>
      </UPage>
    </UContainer>

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Built with Nuxt UI • © 2026
        </p>
      </template>

      <template #right>
        <UButton icon="i-simple-icons-discord" aria-label="Discord" color="neutral" variant="ghost" />
        <UButton icon="i-simple-icons-x" aria-label="X" color="neutral" variant="ghost" />
        <UButton :icon="studioIcons.github" aria-label="GitHub" color="neutral" variant="ghost" />
      </template>
    </UFooter>
  </div>
</template>
