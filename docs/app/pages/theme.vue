<script setup lang="ts">
import type { ThemeDoc } from '../utils/theme-engine'

const { track } = useAnalytics()
const { applyDoc } = useThemeStudio()
const { currentDoc, resetTheme } = useTheme()

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
})

/**
 * Undo/redo over whole theme documents — the same serialize/restore pair
 * exports and presets already use, so one history entry is one applyDoc
 * away. A debounced capture folds slider-drag bursts (and a reset) into
 * single steps. Session-only by design.
 */
const past = ref<ThemeDoc[]>([])
const future = ref<ThemeDoc[]>([])
let lastSnapshot = ''
let pendingRestore = false

onMounted(() => {
  lastSnapshot = JSON.stringify(currentDoc())
})

let captureTimeout: ReturnType<typeof setTimeout> | undefined
watch(() => (mounted.value ? JSON.stringify(currentDoc()) : undefined), (snapshot) => {
  if (!snapshot) return
  clearTimeout(captureTimeout)
  captureTimeout = setTimeout(() => {
    if (pendingRestore) {
      // the first settle after our own undo/redo restore — realign without
      // recording, however long the flush took
      pendingRestore = false
      lastSnapshot = snapshot
      return
    }
    if (snapshot === lastSnapshot) return
    past.value.push(JSON.parse(lastSnapshot))
    if (past.value.length > 50) past.value.shift()
    future.value = []
    lastSnapshot = snapshot
  }, 350)
})

function restore(doc: ThemeDoc) {
  pendingRestore = true
  applyDoc(doc)
  // realignment happens on the next capture, from currentDoc() itself —
  // the applied doc may re-serialize differently than it round-trips
}

function undo() {
  const doc = past.value.pop()
  if (!doc) return
  future.value.push(JSON.parse(lastSnapshot))
  restore(doc)
}

function redo() {
  const doc = future.value.pop()
  if (!doc) return
  past.value.push(JSON.parse(lastSnapshot))
  restore(doc)
}

defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo,
  escape: () => {
    if (fullscreen.value) fullscreen.value = false
  }
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

/** UI-hiding fullscreen: only the preview stays (not browser fullscreen). */
const fullscreen = useState('theme-studio-fullscreen', () => false)

// The state is app-level (the site header gates on it) — never let it
// leak past the studio.
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

          <USelect
            v-model="view"
            :items="viewTabs"
            :icon="viewTabs.find(tab => tab.value === view)?.icon"
            size="sm"
            color="neutral"
            variant="subtle"
            class="w-36 shrink-0"
          />

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
