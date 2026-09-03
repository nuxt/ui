<script setup lang="ts">
const route = useRoute()
const { desktopLinks } = useHeader()
const { open } = useChat()
const { track } = useAnalytics()
const studioIcons = useStudioIcons()
const extraStudioIcons = useStudioExtraIcons()

// The module route caches nuxt.com's stats for an hour, only the star count
// rides the payload (the full response carries the team and contributors).
const { data: stars } = await useFetch('/api/module.json', {
  key: 'github-stars',
  transform: module => module?.stats?.stars ?? 0
})
const { format } = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const starsLabel = computed(() => (stars.value ? format(stars.value).toLowerCase() : undefined))

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

      <VersionMenu />
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" content-orientation="vertical" />

    <template #right>
      <UTheme>
        <ThemeStudioPresetPicker />

        <UTooltip text="Search" :kbds="['meta', 'K']" ignore-non-keyboard-focus>
          <UContentSearchButton :collapsed="false" :kbds="[]" variant="soft" class="min-w-40" />
        </UTooltip>

        <USeparator orientation="vertical" class="self-stretch h-auto" />

        <UTooltip text="Open on GitHub" class="hidden lg:flex">
          <UButton
            color="neutral"
            variant="soft"
            :label="starsLabel"
            to="https://github.com/nuxt/ui"
            target="_blank"
            :icon="extraStudioIcons.github"
            aria-label="Open on GitHub"
          />
        </UTooltip>

        <USeparator orientation="vertical" class="self-stretch h-auto" />

        <UTooltip text="Ask AI" :kbds="['meta', 'I']" ignore-non-keyboard-focus>
          <UButton
            :icon="studioIcons.assistant"
            color="neutral"
            variant="outline"
            label="Ask AI"
            @click="toggleChat"
          />
        </UTooltip>
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
