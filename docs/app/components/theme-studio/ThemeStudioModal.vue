<script setup lang="ts">
import type { ThemeDoc } from '../../utils/theme-engine'

const { track } = useAnalytics()
const { applyDoc, studioOpen: open } = useThemeStudio()
const { currentDoc, resetTheme } = useTheme()

const route = useRoute()
const router = useRouter()

// Resolved AFTER mount: the preference is client-only, and hydration adopts
// SSR attributes without patching — a post-mount flip is a real update.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true

  // ?studio survives reloads and makes an open studio linkable. Vaul
  // rejects an open set during its own mount — wait a frame.
  if (route.query.studio !== undefined) {
    requestAnimationFrame(() => {
      open.value = true
    })
  }
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
  meta_z: () => {
    if (open.value) undo()
  },
  meta_shift_z: () => {
    if (open.value) redo()
  },
  ctrl_y: () => {
    if (open.value) redo()
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

/**
 * Drawer snap points: the first exposes just the settings panel, a full
 * pull reveals the preview beside it. Reset to settings on every open.
 * Vaul measures px snaps against the window, and the drawer sits 1rem shy
 * of full width — so settings-only exposure is the 21rem sidebar + 1rem.
 */
const SETTINGS_SNAP = '352px'
const snap = ref<string | number>(SETTINGS_SNAP)

watch(open, (isOpen) => {
  if (isOpen) snap.value = SETTINGS_SNAP
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
  <UDrawer
    v-model:open="open"
    v-model:active-snap-point="snap"
    direction="left"
    :snap-points="[SETTINGS_SNAP, 1]"
    :handle="false"
    handle-only
    :modal="false"
    inset
    title="Theme Studio"
    description="Customize Nuxt UI live: colors, radius, fonts and icons — then export only what you changed."
    :ui="{ content: 'w-[calc(100vw-2rem)] rounded-xl max-w-none overflow-hidden' }"
  >
    <UTooltip text="Theme Studio">
      <UButton
        icon="i-lucide-swatch-book"
        color="neutral"
        variant="ghost"
        aria-label="Open Theme Studio"
      />
    </UTooltip>

    <template #content>
      <div class="flex flex-row w-full h-full bg-neutral-100 dark:bg-neutral-900">
        <div
          class="flex-1 min-w-0 flex flex-col h-full transition-opacity duration-200"
          :class="snap === 1 ? 'opacity-100' : 'opacity-0'"
        >
          <div
            class="shrink-0 flex items-center gap-2 border-default px-4 sm:px-4 py-3"
          >
            <USelect
              v-model="view"
              :items="viewTabs"
              :icon="viewTabs.find(tab => tab.value === view)?.icon"

              color="neutral"
              variant="subtle"
              class="w-32"
            />

            <span class="flex-1" />

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
            class="flex-1 min-w-0 min-h-0 ring ring-default bg-default m-4 mt-0 rounded-lg [&>*]:rounded-[inherit] [&>*]:[contain:paint]"
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
          :ui="{ container: 'py-3 h-full', header: 'p-6 pt-0 pb-3 min-h-0 ', footer: 'p-6 pb-3 pt-3', body: 'py-0 px-6' }"
        >
          <template #header>
            <Logo class="w-auto h-5 shrink-0 mr-auto" />

            <UTooltip :text="snap === 1 ? 'Hide preview' : 'Show preview'">
              <UButton
                :icon="snap === 1 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                color="neutral"
                variant="ghost"
                square
                :aria-label="snap === 1 ? 'Hide preview' : 'Show preview'"
                @click="snap = snap === 1 ? SETTINGS_SNAP : 1"
              />
            </UTooltip>

            <UColorModeSwitch />

            <UTooltip text="Close">
              <UButton
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                square
                aria-label="Close Theme Studio"
                @click="open = false"
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
            <UFieldGroup size="sm">
              <UTooltip text="Undo" :kbds="['meta', 'Z']">
                <UButton
                  icon="i-lucide-undo-2"
                  color="neutral"
                  variant="outline"
                  :disabled="!past.length"
                  aria-label="Undo theme change"
                  @click="undo"
                />
              </UTooltip>

              <UTooltip text="Redo" :kbds="['meta', 'shift', 'Z']">
                <UButton
                  icon="i-lucide-redo-2"
                  color="neutral"
                  variant="outline"
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
                variant="outline"
                size="sm"
                aria-label="Reset theme"
                @click="resetTheme"
              />
            </UTooltip>
          </template>
        </USidebar>
      </div>
    </template>
  </UDrawer>
</template>
