<script setup lang="ts">
const route = useRoute()
const { desktopLinks } = useHeader()
const { open } = useChat()
const { track } = useAnalytics()
// The Ask-AI button skins to the applied icon pack, like the rest of the
// studio chrome (the theme applies site-wide, so this stays consistent).
const studioIcons = useStudioIcons()

function toggleChat() {
  if (!open.value) {
    track('AI Chat Opened', { source: 'header' })
  }
  open.value = !open.value
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <UHeader
    :ui="{
      container: [route.path.startsWith('/blog/') ? 'max-w-none' : '']
    }"
    class="flex flex-col"
  >
    <template #left>
      <HeaderLogo />
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" content-orientation="vertical" />

    <template #right>
      <UTheme :props="{ button: { size: 'sm' } }">
        <UTooltip text="Search" :kbds="['meta', 'K']" ignore-non-keyboard-focus>
          <UContentSearchButton :collapsed="false" variant="soft" class="min-w-40" />
        </UTooltip>

        <ThemeStudioPresetPicker />

        <UTooltip text="Open on GitHub" class="hidden lg:flex">
          <UButton
            color="neutral"
            variant="soft"
            label="7k+"
            to="https://github.com/nuxt/ui"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
          />
        </UTooltip>

        <!-- <UTooltip text="Ask AI" :kbds="['meta', 'I']" ignore-non-keyboard-focus>
          <UButton
            color="neutral"
            variant="soft"
            label="Ask AI"
            @click="toggleChat"
          />
        </UTooltip> -->
      </UTheme>
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
