<script setup lang="ts">
const { track } = useAnalytics()
const { reset, style, studioOpen: open } = useThemeStudio()
const { modes, mode } = useTheme()
const colorMode = useColorMode()

const route = useRoute()
const router = useRouter()

// Resolved AFTER mount: the preference is client-only, and hydration adopts
// SSR attributes without patching — a post-mount flip is a real update.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true

  // ?studio survives reloads and makes an open studio linkable.
  if (route.query.studio !== undefined) {
    open.value = true
  }
})

watch(open, (isOpen) => {
  const { studio: _studio, ...query } = route.query
  router.replace({ query: isOpen ? { ...query, studio: null } : query })
})

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Studio Opened')
  }
})

const sidebarOpen = ref(true)

// Both floating panels wear IDENTICAL chrome: ring edges (default-width
// rings follow the studio width variable) and one shared shadow treatment,
// so the sidebar and preview card always match.
const chromeShadow = computed(() => {
  const shadow = style.value.shadow
  if (shadow === 'none') return 'shadow-none'
  if (shadow === 'hard') return 'shadow-(--ui-shadow-hard-lg)'
  if (shadow === 'soft') return 'shadow-lg shadow-(color:--ui-shadow-final-soft)'
  return 'shadow-lg'
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
      <div class="flex flex-row w-full h-full bg-neutral-200 dark:bg-neutral-950">
        <USidebar
          v-model:open="sidebarOpen"
          variant="floating"
          :style="{ '--sidebar-width': '21rem' }"
          :ui="{ container: 'pe-0', header: 'bg-elevated/50', body: 'p-0 gap-0 bg-default', footer: 'bg-elevated/50', inner: [chromeShadow, 'bg-default'] }"
        >
          <template #header>
            <Logo class="w-auto h-6 shrink-0 mr-auto" />

            <UTooltip v-for="m in modes" :key="m.label" :text="`${m.label} mode`" class="capitalize">
              <UButton
                :icon="m.icon"
                color="neutral"
                variant="ghost"
                size="xs"
                square
                :active="mounted && colorMode.preference === m.label"
                active-color="primary"
                active-variant="subtle"
                :aria-label="`${m.label} mode`"
                @click="mode = m.label"
              />
            </UTooltip>
          </template>

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
            class="flex-1 min-w-0 min-h-0 ring ring-default bg-default m-4 mt-0 rounded-lg"
            :class="[chromeShadow, view === 'grid' ? 'overflow-y-auto' : 'overflow-hidden']"
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
