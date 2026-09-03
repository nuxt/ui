<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem, PageLink } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

// Left aside: the template renders UContentNavigation from @nuxt/content,
// content-coupled, so the same tree is faked with a vertical UNavigationMenu.
const navLinks: NavigationMenuItem[] = [{
  label: 'Getting Started',
  type: 'trigger',
  defaultOpen: true,
  children: [
    { label: 'Introduction', icon: studioIcons.home },
    { label: 'Installation', icon: 'i-lucide-download' },
    { label: 'Usage', icon: studioIcons.settings, active: true }
  ]
}, {
  label: 'Essentials',
  type: 'trigger',
  defaultOpen: true,
  children: [
    { label: 'Markdown Syntax', icon: studioIcons.heading },
    { label: 'Code Blocks', icon: 'i-lucide-code' },
    { label: 'Prose Components', icon: 'i-lucide-component' },
    { label: 'Images & Embeds', icon: studioIcons.image }
  ]
}, {
  label: 'AI',
  type: 'trigger',
  defaultOpen: true,
  children: [
    { label: 'MCP Server', icon: 'i-lucide-bot' },
    { label: 'LLMs.txt', icon: appConfig.ui.icons.file }
  ]
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
  { label: 'Releases', icon: 'i-lucide-rocket' }
]

const frontmatterFields = [
  { key: 'title', type: 'string', description: 'Page title, shown in the header and navigation' },
  { key: 'description', type: 'string', description: 'Page description, shown below the title' },
  { key: 'navigation.icon', type: 'string', description: 'Icon displayed next to the link in the aside' }
]

const appConfigCode = `export default defineAppConfig({
  header: {
    title: 'Docs',
    to: '/',
    // Show or hide the search bar
    search: true,
    // Show or hide the color mode button
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt-ui-templates/docs',
      'target': '_blank',
      'aria-label': 'GitHub'
    }]
  }
})`
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
        <UButton icon="i-lucide-sun-moon" aria-label="Color mode" color="neutral" variant="ghost" />
        <UButton :icon="studioIcons.github" aria-label="GitHub" color="neutral" variant="ghost" />
      </template>
    </UHeader>

    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UNavigationMenu
              :items="navLinks"
              orientation="vertical"
              highlight
              :ui="{ linkTrailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            />
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
            <ProseP>
              This is only a basic example of what you can achieve with
              <span class="text-primary font-medium border-b border-transparent hover:border-primary cursor-pointer">Nuxt UI</span>,
              you can tweak it to match your needs. The template uses several Nuxt modules underneath like
              <ProseCode>@nuxt/content</ProseCode> for the content and <ProseCode>nuxt-og-image</ProseCode>
              for social previews.
            </ProseP>

            <ProseTip>
              Learn more on how to take the most out of Nuxt UI!
            </ProseTip>

            <ProseH2>
              Writing content
            </ProseH2>

            <ProseP>
              You can just start writing <ProseCode>.md</ProseCode> or <ProseCode>.yml</ProseCode> files in the
              <ProseCode>content/</ProseCode> directory to have your pages updated. The navigation will be
              automatically generated in the left aside and in the mobile menu. You will also be able to go
              through your content with full-text search.
            </ProseP>

            <ProseP>
              Each page supports a few frontmatter fields to customize how it appears:
            </ProseP>

            <ProseTable>
              <ProseThead>
                <ProseTr>
                  <ProseTh>Key</ProseTh>
                  <ProseTh>Type</ProseTh>
                  <ProseTh>Description</ProseTh>
                </ProseTr>
              </ProseThead>
              <ProseTbody>
                <ProseTr v-for="field in frontmatterFields" :key="field.key">
                  <ProseTd>
                    <ProseCode>{{ field.key }}</ProseCode>
                  </ProseTd>
                  <ProseTd>
                    <ProseCode>{{ field.type }}</ProseCode>
                  </ProseTd>
                  <ProseTd>{{ field.description }}</ProseTd>
                </ProseTr>
              </ProseTbody>
            </ProseTable>

            <ProseH2>
              App Configuration
            </ProseH2>

            <ProseP>
              In addition to <ProseCode>@nuxt/ui</ProseCode> configuration through the
              <ProseCode>app.config.ts</ProseCode>, this template lets you customize the
              <ProseCode>Header</ProseCode>, <ProseCode>Footer</ProseCode> and the
              <ProseCode>Table of contents</ProseCode> components.
            </ProseP>

            <ProseH3>
              Header
            </ProseH3>

            <ProsePre filename="app.config.ts" :icon="studioIcons.settings" :code="appConfigCode">
              {{ appConfigCode }}
            </ProsePre>

            <ProseH3>
              Footer
            </ProseH3>

            <ProseP>
              The footer follows the same pattern: update the bottom left credits, toggle the color mode
              button and customize the social links, all from a single object in your app config.
            </ProseP>

            <USeparator />

            <!-- UContentSurround is content-coupled: same prev/next look with a UPageCard pair. -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <UPageCard
                :icon="appConfig.ui.icons.arrowLeft"
                title="Installation"
                description="Get started with the documentation template in a few steps."
                variant="outline"
                :ui="{ leadingIcon: 'text-muted group-hover:text-primary transition-colors' }"
              />
              <UPageCard
                :icon="appConfig.ui.icons.arrowRight"
                title="Markdown Syntax"
                description="Headings, lists, links and everything Markdown supports."
                variant="outline"
                class="text-right"
                :ui="{ wrapper: 'items-end', leadingIcon: 'text-muted group-hover:text-primary transition-colors' }"
              />
            </div>
          </UPageBody>

          <template #right>
            <div class="hidden lg:flex flex-col gap-6 sticky top-(--ui-header-height) py-8">
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
