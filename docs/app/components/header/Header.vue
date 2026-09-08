<script setup lang="ts">
const route = useRoute()
const { desktopLinks } = useHeader()
const { open } = useChat()
const { track } = useAnalytics()

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
      container: [route.path.startsWith('/blog/') ? 'max-w-none' : ''],
      right: 'gap-0.5'
    }"
    class="flex flex-col"
  >
    <template #left>
      <HeaderLogo />

      <VersionMenu v-if="route.path.startsWith('/docs/')" />
    </template>

    <UNavigationMenu :items="desktopLinks" variant="link" content-orientation="vertical" />

    <template #right>
      <UTooltip text="Search" :kbds="['meta', 'K']" ignore-non-keyboard-focus>
        <UContentSearchButton />
      </UTooltip>

      <!-- lazy for the theme engine it pulls, hydrated on idle: a plain
             `Lazy` drops the server-rendered button until the chunk lands -->
      <LazyThemeStudioPresetPicker hydrate-on-idle />

      <UTooltip text="Open on GitHub" class="hidden lg:flex" ignore-non-keyboard-focus>
        <UButton
          color="neutral"
          variant="ghost"
          :label="starsLabel"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="Open on GitHub"
        />
      </UTooltip>

      <USeparator orientation="vertical" class="h-auto self-stretch py-1.5 mx-1.5 lg:me-3" />

      <UTooltip text="Ask AI" :kbds="['meta', 'I']" class="hidden lg:flex" ignore-non-keyboard-focus>
        <UButton
          color="neutral"
          variant="outline"
          label="Ask AI"
          aria-label="Ask AI"
          :ui="{ label: 'hidden sm:inline' }"
          @click="toggleChat"
        >
          <template #leading>
            <NuxiIcon class="size-5 shrink-0" />
          </template>
        </UButton>
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
