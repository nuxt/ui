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

// ⌃⇧D flips the mode without a click, so open panels survive the switch.
// The chord threads several needles: bare Shift+D is a screen-reader
// landmark key (and a WCAG 2.1.4 character shortcut); macOS eats ⌘⇧L
// (Search-with-Google Service) and fires ⌘⇧D's menu binding (bookmark all
// tabs) at the NSMenu level where pages can't block it. Control chords
// have no macOS menu bindings, and Windows accelerators are preventable.
const colorMode = useColorMode()
function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo,
  ctrl_shift_d: toggleColorMode
})

// Esc exits fullscreen — but NOT through defineShortcuts, which
// preventDefaults every matched key and would stop Reka's dismissable
// layers from ever seeing Escape (no popover on /theme could close). A
// plain listener defers whenever a layer is open, so Esc closes the
// popover first and exits fullscreen on the next press.
function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !fullscreen.value || event.defaultPrevented) return
  // Only VISIBLE layers defer — pre-mounted closed overlays (the search
  // palette) keep their layer marker in the DOM.
  const layers = document.querySelectorAll('[data-dismissable-layer]')
  if ([...layers].some(layer => layer.getClientRects().length)) return
  fullscreen.value = false
}
onMounted(() => window.addEventListener('keydown', onEscape))

// The fullscreen state is app-level (the site header gates on it) — never
// let it leak past the studio. The pending capture flushes rather than
// dies: an edit made inside the debounce window would otherwise vanish
// from history, and a pending post-restore realign would stay armed and
// swallow the next edit after remount.
onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  fullscreen.value = false
  clearTimeout(captureTimeout)
  capture(JSON.stringify(currentDoc()))
})

const settingGroups = [
  { label: 'Colors', value: 'colors' },
  { label: 'General', value: 'general' },
  { label: 'Style', value: 'style' }
] as const

/**
 * Fullscreen toolbar reveal. Pointer proximity is tracked with a mousemove
 * listener instead of an invisible hover overlay — an overlay would eat
 * clicks on the preview's bottom edge. The bar also pins open while any of
 * its panels is open: their content portals to <body>, so hover/focus-within
 * alone would retract the bar underneath its own popovers.
 */
const nearBottom = ref(false)
function onPointerNear(event: MouseEvent) {
  nearBottom.value = window.innerHeight - event.clientY <= 96
}
watch(fullscreen, (on) => {
  if (on) {
    window.addEventListener('mousemove', onPointerNear)
  } else {
    window.removeEventListener('mousemove', onPointerNear)
    nearBottom.value = false
  }
})
onUnmounted(() => window.removeEventListener('mousemove', onPointerNear))

const openPanels = reactive({ presets: false, colors: false, general: false, style: false, view: false })
const toolbarPinned = computed(() => nearBottom.value || Object.values(openPanels).some(Boolean))

/** The shared import/export modal — the two toolbar buttons pick its mode. */
const shareOpen = ref(false)
const shareMode = ref<'import' | 'export'>('export')
</script>

<template>
  <!-- The app root (#__nuxt) paints bg-default via nuxt.config rootAttrs —
       the page tint composites on top of it. -->
  <main class="bg-elevated/25">
    <UContainer :class="fullscreen && 'max-w-none px-0 sm:px-0 lg:px-0'">
      <!-- Structured borders (like /releases and /templates): border-x rails
           run from the header's bottom border to the viewport bottom at the
           container's padding edge — no floating card. -->
      <div class="flex flex-col w-full bg-default" :class="fullscreen ? 'h-dvh' : 'h-[calc(100dvh-var(--ui-header-height))] border-x border-default'">
        <!-- The preview: the grid scrolls inside it; the app-shell views own
             their height and scroll internally. [contain:paint] puts hard
             paint containment on the views' own scrollers — Chromium won't
             clip nested composited layers (sticky headers, filtered glows)
             by an ancestor's overflow alone. -->
        <div
          class="flex-1 min-h-0 [&>*]:[contain:paint]"
          :class="view === 'grid' ? 'overflow-y-auto' : 'overflow-hidden'"
        >
          <Playground v-if="view === 'grid'" class="py-4 sm:py-6" />
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
        <!-- UContainer's own recipe, so the floating bar's edges line up
             with every other page's content. -->
        <div :class="fullscreen ? 'group fixed bottom-0 inset-x-0 z-50 pointer-events-none w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8' : 'shrink-0'">
          <!-- thin touch affordance only — mouse reveal is proximity-driven -->
          <div v-if="fullscreen" class="absolute bottom-0 inset-x-0 h-2 pointer-events-auto" />

          <div
            class="flex items-center gap-2 p-3 overflow-x-auto"
            :class="fullscreen ? [
              'mt-4 rounded-t-lg bg-default/75 backdrop-blur ring ring-default shadow-lg pointer-events-auto transition-transform duration-200',
              toolbarPinned ? 'translate-y-0' : 'translate-y-[calc(100%+6px)] group-hover:translate-y-0 group-focus-within:translate-y-0'
            ] : 'border-t border-default'"
          >
            <ThemeStudioPresetMenu v-model:open="openPanels.presets" keep-panels class="w-56 shrink-0" />

            <UPopover
              v-for="settingGroup in settingGroups"
              :key="settingGroup.value"
              v-model:open="openPanels[settingGroup.value]"
              :content="{ align: 'start', onInteractOutside: keepPanels }"
            >
              <UButton
                :label="settingGroup.label"
                color="neutral"
                variant="subtle"
                trailing-icon="i-lucide-chevron-down"
              />

              <template #content>
                <ThemeStudioControls :group="settingGroup.value" class="w-80 max-h-[70vh] overflow-y-auto" />
              </template>
            </UPopover>

            <UTooltip text="Color mode" :kbds="['ctrl', 'shift', 'D']">
              <UColorModeSwitch data-keep-panels class="shrink-0" />
            </UTooltip>

            <span class="flex-1" />

            <!-- The header center hosts the view switcher on desktop; the
               toolbar keeps a select for mobile and for fullscreen, where
               the header is hidden. -->
            <USelect
              v-model="view"
              v-model:open="openPanels.view"
              :items="views"
              :icon="views.find(tab => tab.value === view)?.icon"
              color="neutral"
              variant="subtle"
              class="w-36 shrink-0"
              :class="!fullscreen && 'lg:hidden'"
            />

            <UFieldGroup class="shrink-0">
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
                aria-label="Reset theme"
                @click="resetTheme()"
              />
            </UTooltip>

            <div class="shrink-0">
              <UFieldGroup>
                <UTooltip text="Import theme">
                  <UButton
                    icon="i-lucide-upload"
                    color="neutral"
                    variant="subtle"
                    aria-label="Import theme"
                    @click="shareMode = 'import'; shareOpen = true"
                  />
                </UTooltip>

                <UButton
                  label="Export"
                  icon="i-lucide-download"
                  color="neutral"
                  variant="subtle"
                  @click="shareMode = 'export'; shareOpen = true"
                />
              </UFieldGroup>
            </div>

            <UTooltip :text="fullscreen ? 'Exit fullscreen' : 'Fullscreen preview'" :kbds="fullscreen ? ['Esc'] : undefined">
              <UButton
                :icon="fullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'"
                color="neutral"
                variant="subtle"
                :aria-label="fullscreen ? 'Exit fullscreen preview' : 'Fullscreen preview'"
                @click="fullscreen = !fullscreen"
              />
            </UTooltip>
          </div>
        </div>
      </div>
    </UContainer>

    <ThemeStudioShareModal v-model:open="shareOpen" v-model:mode="shareMode" />
  </main>
</template>
