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
  ctrl_y: redo
})

const sidebarOpen = ref(true)

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
  <main>
    <UContainer>
      <!-- [contain:layout] keeps the sidebar's fixed container anchored to the
           studio area instead of the viewport (the drawer's transform used to
           do this implicitly). -->
      <div class="flex flex-row w-full h-[calc(100dvh-var(--ui-header-height))] bg-neutral-100 dark:bg-neutral-900 [contain:layout]">
        <div class="flex-1 min-w-0 flex flex-col h-full">
          <div class="shrink-0 flex items-center gap-2 border-default py-3">
            <USelect
              v-model="view"
              :items="viewTabs"
              :icon="viewTabs.find(tab => tab.value === view)?.icon"
              color="neutral"
              variant="subtle"
              class="w-36"
            />

            <span class="flex-1" />
            <UColorModeSwitch />

            <UTooltip :text="sidebarOpen ? 'Hide settings' : 'Show settings'">
              <UButton
                :icon="sidebarOpen ? 'i-lucide-panel-right-close' : 'i-lucide-panel-right-open'"
                color="neutral"
                variant="ghost"
                aria-label="Toggle settings panel"
                @click="sidebarOpen = !sidebarOpen"
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
            class="flex-1 min-w-0 min-h-0 ring ring-default bg-default mb-4 rounded-lg [&>*]:rounded-[inherit] [&>*]:[contain:paint]"
            :class="[
              view === 'grid' ? 'overflow-y-auto' : 'overflow-hidden',
              // the open sidebar's own padding provides the gap; collapsed,
              // the card needs its margin back
              sidebarOpen ? 'me-0' : 'me-4'
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

        <USidebar
          v-model:open="sidebarOpen"
          side="right"
          variant="inset"
          :style="{ '--sidebar-width': '21rem' }"
          :ui="{ container: 'py-3 ps-6 h-full', header: 'pb-3 px-0 min-h-0', footer: 'py-3 px-0', body: 'py-0 px-0' }"
        >
          <template #header>
            <div class="flex-1 min-w-0">
              <ThemeStudioImport />
            </div>

            <div class="flex-1 min-w-0">
              <ThemeStudioExport />
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
          </template>

          <ThemeStudioControls />
        </USidebar>
      </div>
    </UContainer>
  </main>
</template>
