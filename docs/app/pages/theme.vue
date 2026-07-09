<script setup lang="ts">
const { track } = useAnalytics()
const { currentDoc, resetTheme } = useTheme()

// View and fullscreen are app-level state: the site header hosts the view
// switcher while on /theme and hides itself in fullscreen.
const { view, fullscreen, views } = useThemeStudioView()
const { past, future, align, capture, undo, redo } = useThemeStudioHistory()

useSeoMeta({
  title: 'Theme Studio',
  description: 'Customize Nuxt UI live: colors, radius, fonts and icons — then export only what you changed.'
})

// Resolved AFTER mount: the preference is client-only, and hydration adopts
// SSR attributes without patching — a post-mount flip is a real update.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
  track('Theme Studio Opened')
  align(JSON.stringify(currentDoc()))
})

// A debounced capture folds slider-drag bursts (and a reset) into single
// history steps.
let captureTimeout: ReturnType<typeof setTimeout> | undefined
watch(() => (mounted.value ? JSON.stringify(currentDoc()) : undefined), (snapshot) => {
  if (!snapshot) return
  clearTimeout(captureTimeout)
  captureTimeout = setTimeout(() => capture(snapshot), 350)
})

defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo,
  escape: () => {
    if (fullscreen.value) fullscreen.value = false
  }
})

// The fullscreen state is app-level (the site header gates on it) — never
// let it leak past the studio.
onUnmounted(() => {
  fullscreen.value = false
})

const settingGroups = [
  { label: 'Colors', value: 'colors' },
  { label: 'General', value: 'general' },
  { label: 'Style', value: 'style' }
] as const
</script>

<template>
  <main class="bg-neutral-100 dark:bg-neutral-900">
    <UContainer :class="fullscreen && 'max-w-none px-0 sm:px-0 lg:px-0'">
      <div class="flex flex-col w-full" :class="fullscreen ? 'h-dvh' : 'h-[calc(100dvh-var(--ui-header-height))]'">
        <!-- The floating preview card: the grid scrolls inside it; the
             app-shell views own their height and scroll internally.
             [&>*]:rounded-[inherit] + [contain:paint] put the radius and
             hard paint containment on the views' own scrollers — Chromium
             won't clip nested composited layers (sticky headers, filtered
             glows) by an ancestor's radius or overflow alone. -->
        <div
          class="flex-1 min-w-0 min-h-0 bg-default [&>*]:rounded-[inherit] [&>*]:[contain:paint]"
          :class="[
            view === 'grid' ? 'overflow-y-auto' : 'overflow-hidden',
            fullscreen ? 'rounded-none' : 'ring ring-default mt-4 rounded-lg'
          ]"
        >
          <Playground v-if="view === 'grid'" class="py-4" />
          <ThemeStudioViewDashboard v-else-if="view === 'dashboard'" />
          <ThemeStudioViewChat v-else-if="view === 'chat'" />
          <ThemeStudioViewSaas v-else-if="view === 'saas'" />
          <ThemeStudioViewLanding v-else-if="view === 'landing'" />
          <ThemeStudioViewA11y v-else-if="view === 'a11y'" />
        </div>

        <!-- One toolbar at the bottom: history leftmost, presets and
             setting-group popovers, document actions on the right. In
             fullscreen it floats over the bottom edge at the normal
             container width, peeking a few pixels until the pointer
             nears the bottom (Esc still exits); only that strip catches
             the pointer so the preview stays clickable. -->
        <div :class="fullscreen ? 'group fixed bottom-0 inset-x-0 z-50 pointer-events-none' : 'shrink-0'">
          <div v-if="fullscreen" class="absolute bottom-0 inset-x-0 h-8 pointer-events-auto" />

          <div
            class="flex items-center gap-2 py-3 overflow-x-auto"
            :class="fullscreen && 'my-4 mx-auto w-[calc(100%-2rem)] max-w-(--ui-container) px-4 rounded-lg bg-default ring ring-default shadow-lg pointer-events-auto translate-y-[calc(100%+6px)] group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-200'"
          >
            <UFieldGroup size="sm">
              <UTooltip text="Undo" :kbds="['meta', 'Z']">
                <UButton
                  icon="i-lucide-undo-2"
                  color="neutral"
                  variant="subtle"
                  :disabled="!past.length"
                  aria-label="Undo theme change"
                  @click="undo"
                />
              </UTooltip>

              <UTooltip text="Redo" :kbds="['meta', 'shift', 'Z']">
                <UButton
                  icon="i-lucide-redo-2"
                  color="neutral"
                  variant="subtle"
                  :disabled="!future.length"
                  aria-label="Redo theme change"
                  @click="redo"
                />
              </UTooltip>
            </UFieldGroup>

            <UTooltip text="Reset theme">
              <UButton
                icon="i-lucide-rotate-ccw"
                color="neutral"
                variant="subtle"
                size="sm"
                aria-label="Reset theme"
                @click="resetTheme"
              />
            </UTooltip>

            <ThemeStudioPresetMenu class="w-56 shrink-0" />

            <UPopover
              v-for="settingGroup in settingGroups"
              :key="settingGroup.value"
              :content="{ align: 'start' }"
            >
              <UButton
                :label="settingGroup.label"
                color="neutral"
                variant="subtle"
                size="sm"
                trailing-icon="i-lucide-chevron-down"
              />

              <template #content>
                <ThemeStudioControls :group="settingGroup.value" class="w-80 max-h-[70vh] overflow-y-auto p-4" />
              </template>
            </UPopover>

            <span class="flex-1" />

            <!-- The header center hosts the view switcher on desktop; the
               toolbar keeps a select for mobile and for fullscreen, where
               the header is hidden. -->
            <USelect
              v-model="view"
              :items="views"
              :icon="views.find(tab => tab.value === view)?.icon"
              size="sm"
              color="neutral"
              variant="subtle"
              class="w-36 shrink-0"
              :class="!fullscreen && 'lg:hidden'"
            />

            <UColorModeButton size="sm" variant="subtle" />

            <UTooltip :text="fullscreen ? 'Exit fullscreen' : 'Fullscreen preview'" :kbds="fullscreen ? ['Esc'] : undefined">
              <UButton
                :icon="fullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'"
                color="neutral"
                variant="subtle"
                size="sm"
                :aria-label="fullscreen ? 'Exit fullscreen preview' : 'Fullscreen preview'"
                @click="fullscreen = !fullscreen"
              />
            </UTooltip>

            <div class="shrink-0">
              <UFieldGroup>
                <ThemeStudioImport />

                <ThemeStudioExport />
              </UFieldGroup>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </main>
</template>
