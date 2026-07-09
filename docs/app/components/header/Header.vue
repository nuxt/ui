<script setup lang="ts">
const route = useRoute()
const { desktopLinks } = useHeader()
const { open } = useChat()
const { track } = useAnalytics()

function toggleChat() {
  if (!open.value) {
    track('AI Chat Opened', { source: 'header' })
  }
  open.value = !open.value
}

/**
 * On /theme the header center becomes the studio's view switcher, with the
 * regular pages folded into a single Menu popover.
 */
const isStudio = computed(() => route.path === '/theme')

const { view, views } = useThemeStudioView()

const studioMenu = [
  {
    label: 'Menu',
    children: [{
      label: 'Docs',
      description: 'Learn how to build with Nuxt UI.',
      icon: 'i-lucide-book-open',
      to: '/docs'
    }, {
      label: 'Templates',
      description: 'Start from a ready-made template.',
      icon: 'i-lucide-panels-top-left',
      to: '/templates'
    }, {
      label: 'Showcase',
      description: 'Discover websites built with Nuxt UI.',
      icon: 'i-lucide-presentation',
      to: '/showcase'
    }, {
      label: 'Community',
      description: 'Explore projects built around Nuxt UI.',
      icon: 'i-lucide-globe',
      to: '/community'
    }, {
      label: 'Blog',
      description: 'Read the latest news and updates.',
      icon: 'i-lucide-newspaper',
      to: '/blog'
    }, {
      label: 'Figma',
      description: 'Design with the official Figma kit.',
      icon: 'i-simple-icons-figma',
      to: '/figma'
    }, {
      label: 'Releases',
      description: 'Follow what ships in each release.',
      icon: 'i-lucide-rocket',
      to: '/releases'
    }]
  }
]
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <UHeader
    :ui="{
      left: 'min-w-0',
      right: 'gap-0.5',
      container: [route.path.startsWith('/blog/') ? 'max-w-none' : '']
    }"
    class="flex flex-col"
  >
    <template #left>
      <HeaderLogo />

      <VersionMenu />
    </template>

    <div v-if="isStudio" class="flex items-center gap-1">
      <UTabs
        v-model="view"
        :items="views"
        :content="false"
        color="primary"
        size="sm"
      />

      <!-- A single trigger makes the menu root (and so the default
           popover viewport) only as wide as the button — size the
           popover explicitly. -->
      <UNavigationMenu
        :items="studioMenu"
        variant="link"
        content-orientation="vertical"
        :ui="{ viewportWrapper: 'w-[25rem]', content: 'w-[25rem]' }"
      />
    </div>
    <UNavigationMenu v-else :items="desktopLinks" variant="link" content-orientation="vertical" />

    <template #right>
      <UTooltip text="Search" :kbds="['meta', 'K']" ignore-non-keyboard-focus>
        <UContentSearchButton />
      </UTooltip>

      <UTooltip text="Ask AI" :kbds="['meta', 'I']" ignore-non-keyboard-focus>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-lucide-bot-message-square"
          aria-label="Ask AI for help"
          @click="toggleChat"
        />
      </UTooltip>

      <UTooltip text="Theme Studio">
        <UButton
          icon="i-lucide-swatch-book"
          color="neutral"
          active-color="primary"
          :active="route.path === '/theme'"
          variant="ghost"
          to="/theme"
          aria-label="Open Theme Studio"
        />
      </UTooltip>

      <UTooltip text="Open on GitHub" class="hidden lg:flex">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>

    <template #toggle="{ open, toggle, ui }">
      <HeaderToggleButton
        :open="open"
        :class="ui.toggle({ toggleSide: 'right' })"
        @click="toggle"
      />
    </template>

    <template #body>
      <HeaderBody />
    </template>

    <template v-if="route.path.startsWith('/docs/')" #bottom>
      <HeaderBottom />
    </template>
  </UHeader>
</template>
