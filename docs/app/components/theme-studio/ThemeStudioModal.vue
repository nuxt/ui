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
const PREVIEW_EDGE: Record<number, string> = { 0: 'border-0', 1: 'border', 2: 'border-2', 3: 'border-3', 4: 'border-4' }
const SIDEBAR_RING: Record<number, string> = { 0: 'ring-0', 1: 'ring-1', 2: 'ring-2', 3: 'ring-3', 4: 'ring-4' }

const chromeWidth = computed(() => {
  const border = style.value.border
  if (!border || border === 'default') return 1
  if (border === 'none') return 0
  return style.value.borderWidth ?? 2
})

// The studio's own floating panels cast theme-correct shadows too. The
// sidebar override merges through tv (recoloring its stock shadow-lg is
// enough); the preview card's plain :class doesn't merge, so it gets the
// whole string.
const sidebarShadow = computed(() => {
  const shadow = style.value.shadow
  if (shadow === 'none') return 'shadow-none'
  if (shadow === 'hard') return 'shadow-(--ui-shadow-hard-lg)'
  if (shadow === 'soft') return 'shadow-(color:--ui-shadow-final-soft)'
  return ''
})

const previewShadow = computed(() => {
  const shadow = style.value.shadow
  if (shadow === 'none') return ''
  if (shadow === 'hard') return 'shadow-(--ui-shadow-hard-lg)'
  if (shadow === 'soft') return 'shadow-xl shadow-(color:--ui-shadow-final-soft)'
  return 'shadow-xl'
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
      <div class="flex flex-row w-full h-full bg-default">
        <USidebar
          v-model:open="sidebarOpen"
          variant="floating"
          :style="{ '--sidebar-width': '21rem' }"
          :ui="{ body: 'p-0 gap-0', inner: [sidebarShadow, SIDEBAR_RING[chromeWidth]] }"
        >
          <ThemeStudioControls />

          <template #footer>
            <div class="flex-1 min-w-0">
              <ThemeStudioImport />
            </div>

            <div class="flex-1 min-w-0">
              <ThemeStudioExport />
            </div>

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
          </template>
        </USidebar>

        <div class="flex-1 min-w-0 flex flex-col h-full">
          <div
            class="shrink-0 flex items-center gap-2 border-default px-4 sm:px-4 py-3"
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

          <!-- The floating preview card: the grid scrolls inside it; the
               app-shell views own their height and scroll internally. -->
          <div
            class="flex-1 min-w-0 min-h-0 border-default m-4 mt-1 lg:ms-0 rounded-lg"
            :class="[PREVIEW_EDGE[chromeWidth], previewShadow, view === 'grid' ? 'overflow-y-auto' : 'overflow-hidden']"
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
