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
const viewListOpen = ref(false)

// The popover body is a vertical menu so Resources can nest as a
// collapsed group — horizontal popover child lists only render one level.
const studioMenu = [{ label: 'Menu', slot: 'pages' as const }]

const studioMenuLinks = [{
  label: 'Docs',
  icon: 'i-lucide-book-open',
  to: '/docs'
}, {
  label: 'Templates',
  icon: 'i-lucide-panels-top-left',
  to: '/templates'
}, {
  label: 'Figma',
  icon: 'i-simple-icons-figma',
  to: '/figma'
}, {
  label: 'Releases',
  icon: 'i-lucide-rocket',
  to: '/releases'
}, {
  label: 'Resources',
  icon: 'i-lucide-library',
  children: [{
    label: 'Showcase',
    icon: 'i-lucide-presentation',
    to: '/showcase'
  }, {
    label: 'Community',
    icon: 'i-lucide-globe',
    to: '/community'
  }, {
    label: 'Playground',
    icon: 'i-lucide-square-terminal',
    to: '/play',
    target: '_blank'
  }, {
    label: 'Blog',
    icon: 'i-lucide-newspaper',
    to: '/blog'
  }]
}]
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

    <!-- The popover is sized explicitly: with a single trigger the
         default viewport wrapper tracks the root's width, not the
         content's. -->
    <UNavigationMenu
      v-if="isStudio"
      :items="studioMenu"
      variant="link"
      content-orientation="vertical"
      :ui="{ viewportWrapper: 'w-[12rem]', content: 'w-[12rem]' }"
    >
      <template #list-leading>
        <UPopover v-model:open="viewListOpen" :content="{ align: 'center' }">
          <UButton
            :icon="views.find(tab => tab.value === view)?.icon"
            :label="views.find(tab => tab.value === view)?.label"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="subtle"

            aria-label="Preview page"
          />

          <template #content>
            <!-- a 2-column card grid: each view is its /templates screenshot
                 over label + blurb; the studio-only views (grid, a11y) get an
                 icon tile, and the selected card wears a primary ring. -->
            <UListbox
              v-model="view"
              :items="views"
              value-key="value"
              class="w-96"
              :ui="{
                root: 'ring-0 rounded-md',
                content: 'max-h-[70vh]',
                group: 'p-1.5 grid grid-cols-2 gap-1',
                item: 'flex-col rounded-md ring-inset data-[state=checked]:bg-elevated/50',
                itemDescription: 'whitespace-normal line-clamp-2 text-xs',
                itemTrailing: 'hidden',
                itemWrapper: 'p-1'
              }"
              @update:model-value="viewListOpen = false"
            >
              <template #item-leading="{ item }">
                <UColorModeImage
                  v-if="item.image"
                  :light="`${item.image}-light.png`"
                  :dark="`${item.image}-dark.png`"
                  :alt="`${item.label} preview`"
                  width="654"
                  height="368"
                  loading="lazy"
                  class="w-full aspect-video rounded-sm ring ring-default"
                />
                <span v-else class="w-full aspect-video rounded-sm ring ring-default bg-elevated/50 flex items-center justify-center">
                  <UIcon :name="item.icon" class="size-6 text-muted" />
                </span>
              </template>
            </UListbox>
          </template>
        </UPopover>
      </template>

      <template #pages-content>
        <UNavigationMenu
          orientation="vertical"

          :items="studioMenuLinks"
          class="p-2"
        />
      </template>
    </UNavigationMenu>
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

      <ThemeStudioPicker />

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
