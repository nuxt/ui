<script setup lang="ts">
const { track } = useAnalytics()
const { reset, style, studioOpen: open } = useThemeStudio()

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Studio Opened')
  }
})

const sidebarOpen = ref(true)

// The studio's own chrome follows the border treatment too — whole literal
// class strings per width so tailwind's scanner sees them.
const TOOLBAR_EDGE: Record<number, string> = { 0: 'border-b-0', 1: 'border-b', 2: 'border-b-2', 3: 'border-b-3', 4: 'border-b-4' }
const SIDEBAR_EDGE: Record<number, string> = {
  0: 'border-b-0 lg:border-r-0',
  1: 'border-b lg:border-b-0 lg:border-r',
  2: 'border-b-2 lg:border-b-0 lg:border-r-2',
  3: 'border-b-3 lg:border-b-0 lg:border-r-3',
  4: 'border-b-4 lg:border-b-0 lg:border-r-4'
}

const chromeWidth = computed(() => {
  const border = style.value.border
  if (!border || border === 'default') return 1
  if (border === 'none') return 0
  return style.value.borderWidth ?? 2
})

/** Preview views: the bento grid plus app-scale layouts from the real templates. */
const view = ref('grid')

const viewTabs = [
  { label: 'Grid', icon: 'i-lucide-layout-grid', value: 'grid' },
  { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', value: 'dashboard' },
  { label: 'Chat', icon: 'i-lucide-message-circle', value: 'chat' },
  { label: 'SaaS', icon: 'i-lucide-rocket', value: 'saas' },
  { label: 'Landing', icon: 'i-lucide-panels-top-left', value: 'landing' },
  { label: 'A11y', icon: 'i-lucide-accessibility', value: 'a11y' }
]
</script>

<template>
  <UModal
    v-model:open="open"
    fullscreen
    title="Theme Studio"
    description="Customize Nuxt UI live: colors, radius, fonts and icons — then export only what you changed."
  >
    <template #content>
      <div class="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden bg-default">
        <aside
          v-show="sidebarOpen"
          class="shrink-0 lg:w-80 border-default lg:overflow-y-auto"
          :class="SIDEBAR_EDGE[chromeWidth]"
        >
          <ThemeStudioControls />
        </aside>

        <div class="flex-1 flex flex-col min-w-0">
          <div
            class="flex items-center gap-2 border-default px-4 sm:px-6 py-3"
            :class="TOOLBAR_EDGE[chromeWidth]"
          >
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

            <Logo class="w-auto h-4 shrink-0" />

            <h2 class="text-sm font-semibold text-highlighted mt-1 me-2">
              Theme Studio
            </h2>

            <span class="flex-1" />

            <UTabs
              v-model="view"
              :items="viewTabs"
              :content="false"
              size="xs"
              color="primary"
            />

            <span class="flex-1" />

            <ThemeStudioImport />

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

            <USeparator orientation="vertical" class="h-5" />

            <UTooltip text="Close">
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-label="Close Theme Studio"
                @click="open = false"
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
            <ThemeStudioViewSaas v-else-if="view === 'saas'" />
            <ThemeStudioViewLanding v-else-if="view === 'landing'" />
            <ThemeStudioViewA11y v-else-if="view === 'a11y'" />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
