<script setup lang="ts">
const title = 'Theme Studio'
const description = 'Customize Nuxt UI live: colors, radius, fonts and icons — then export only what you changed.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title,
    description
  })
}

const { reset } = useThemeStudio()

const sidebarOpen = ref(true)

/** Preview views: the bento grid plus app-scale layouts from the real templates. */
const view = ref('grid')

const viewTabs = [
  { label: 'Grid', icon: 'i-lucide-layout-grid', value: 'grid' },
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', value: 'dashboard' },
  { label: 'Chat', icon: 'i-lucide-message-circle', value: 'chat' }
]
</script>

<template>
  <main class="flex flex-col lg:flex-row lg:h-[calc(100vh-var(--ui-header-height))]">
    <aside
      v-show="sidebarOpen"
      class="shrink-0 lg:w-80 border-b lg:border-b-0 lg:border-r border-default lg:overflow-y-auto p-4 sm:px-6"
    >
      <ThemeStudioControls />
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <div class="flex items-center gap-2 border-b border-default px-4 sm:px-6 py-3">
        <UTooltip :text="sidebarOpen ? 'Hide settings' : 'Show settings'">
          <UButton
            :icon="sidebarOpen ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Toggle settings panel"
            @click="sidebarOpen = !sidebarOpen"
          />
        </UTooltip>

        <h1 class="text-sm font-semibold text-highlighted me-2">
          Theme Studio
        </h1>

        <span class="flex-1" />

        <UTabs
          v-model="view"
          :items="viewTabs"
          :content="false"
          size="xs"
          color="neutral"
          :ui="{ trigger: 'text-[11px]' }"
        />

        <span class="flex-1" />

        <ThemeStudioExport />

        <UTooltip text="Reset theme">
          <UButton
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="outline"
            size="sm"
            aria-label="Reset theme"
            @click="reset"
          />
        </UTooltip>
      </div>

      <!-- The grid scrolls as a page; the app-shell views own their height
           and scroll internally, so the pane locks (bounded on mobile too). -->
      <div
        class="flex-1 min-h-0 p-0"
        :class="view === 'grid' ? 'lg:overflow-y-auto' : 'overflow-hidden max-lg:h-[75vh]'"
      >
        <ThemeStudioBento v-if="view === 'grid'" />
        <ThemeStudioViewDashboard v-else-if="view === 'dashboard'" />
        <ThemeStudioViewChat v-else-if="view === 'chat'" />
      </div>
    </div>
  </main>
</template>
