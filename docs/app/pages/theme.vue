<script setup lang="ts">
const { track } = useAnalytics()
const { currentDoc, resetTheme } = useTheme()

// View, fullscreen and undo/redo history are app-level state: the site
// header hosts the view switcher and undo/redo/reset while on /theme
// (the toolbar keeps lg:hidden fallbacks for mobile).
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
  { label: 'Style', value: 'style' },
  { label: 'Shades', value: 'tokens' }
] as const
</script>

<template>
  <main class="bg-neutral-100 dark:bg-neutral-900">
    <UContainer :class="fullscreen && 'max-w-none px-0 sm:px-0 lg:px-0'">
      <div class="flex flex-col w-full" :class="fullscreen ? 'h-dvh' : 'h-[calc(100dvh-var(--ui-header-height))]'">
        <!-- One toolbar: presets and setting-group popovers on the left,
             document actions on the right. -->
        <div v-if="!fullscreen" class="shrink-0 flex items-center gap-2 py-3 overflow-x-auto">
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

          <!-- The header center hosts the view switcher on desktop; below
               lg it collapses, so the toolbar keeps a select as fallback. -->
          <USelect
            v-model="view"
            :items="views"
            :icon="views.find(tab => tab.value === view)?.icon"
            size="sm"
            color="neutral"
            variant="subtle"
            class="w-36 shrink-0 lg:hidden"
          />

          <UFieldGroup size="sm" class="lg:hidden">
            <UButton
              icon="i-lucide-undo-2"
              color="neutral"
              variant="subtle"
              :disabled="!past.length"
              aria-label="Undo theme change"
              @click="undo"
            />

            <UButton
              icon="i-lucide-redo-2"
              color="neutral"
              variant="subtle"
              :disabled="!future.length"
              aria-label="Redo theme change"
              @click="redo"
            />

            <UButton
              icon="i-lucide-rotate-ccw"
              color="neutral"
              variant="subtle"
              aria-label="Reset theme"
              @click="resetTheme"
            />
          </UFieldGroup>

          <UColorModeButton size="sm" variant="subtle" />

          <UTooltip text="Fullscreen preview">
            <UButton
              icon="i-lucide-maximize"
              color="neutral"
              variant="subtle"
              size="sm"
              aria-label="Fullscreen preview"
              @click="fullscreen = true"
            />
          </UTooltip>

          <div class="shrink-0">
            <UFieldGroup>
              <ThemeStudioImport />

              <ThemeStudioExport />
            </UFieldGroup>
          </div>
        </div>

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
            fullscreen ? 'rounded-none' : 'ring ring-default mb-4 rounded-lg'
          ]"
        >
          <ThemeStudioBento v-if="view === 'grid'" />
          <ThemeStudioViewDashboard v-else-if="view === 'dashboard'" />
          <ThemeStudioViewChat v-else-if="view === 'chat'" />
          <ThemeStudioViewSaas v-else-if="view === 'saas'" />
          <ThemeStudioViewLanding v-else-if="view === 'landing'" />
          <ThemeStudioViewA11y v-else-if="view === 'a11y'" />
        </div>
      </div>

      <!-- Exit peeks a few pixels into the corner; nearing it slides the
           button fully in (Esc always works). -->
      <div v-if="fullscreen" class="group fixed top-0 right-0 z-50 flex justify-end items-start w-32 h-20 pt-2 pe-4 pointer-events-auto">
        <UTooltip text="Exit fullscreen" :kbds="['Esc']">
          <UButton
            icon="i-lucide-minimize"
            color="neutral"
            variant="subtle"
            class="translate-x-[calc(100%-6px)] group-hover:translate-x-0 transition-transform duration-200"
            aria-label="Exit fullscreen preview"
            @click="fullscreen = false"
          />
        </UTooltip>
      </div>
    </UContainer>
  </main>
</template>
