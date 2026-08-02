<script setup lang="ts">
const { track } = useAnalytics()
const { resetTheme, icon: iconSet, blackAsPrimary } = useTheme()

// Toolbar skins to the applied icon pack; import/chevron reuse the standard
// semantic keys off appConfig.ui.icons.
const studioIcons = useStudioIcons()

// App-level: the site header hosts the view switcher and hides in fullscreen.
const { view, fullscreen } = useThemeStudioView()
const { past, future, snapshot, align, capture, undo, redo } = useThemeStudioHistory()

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
  align(snapshot())
})

// Debounced capture folds slider-drag bursts into single history steps; the
// snapshot spans the doc AND the editor's curve/pin params.
let captureTimeout: ReturnType<typeof setTimeout> | undefined
watch(() => (mounted.value ? snapshot() : undefined), (snap) => {
  if (!snap) return
  clearTimeout(captureTimeout)
  captureTimeout = setTimeout(() => capture(snap), 350)
})

// ⌃⇧D: bare Shift+D is a screen-reader landmark key, and macOS fires ⌘⇧D/⌘⇧L
// menu bindings at the NSMenu level where pages can't block them — control
// chords are the safe zone.
const colorMode = useColorMode()
function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const appConfig = useAppConfig()
const { groupDirty, presets, activePreset, applyPreset, primaryChip, neutralChip } = useThemeStudio()

/**
 * The Colors trigger wears the two colours it owns, so the toolbar reports
 * the current primary and neutral without being opened — the same job the
 * font and icon pickers do by showing their values.
 */
const colorDots = computed(() => [
  blackAsPrimary.value ? undefined : `var(--color-${primaryChip.value}-500)`,
  `var(--color-${neutralChip.value}-500)`
])

/** "Changed from preset" dot per settings tab. */
const groupDirtyFlags = {
  colors: groupDirty('colors'),
  style: groupDirty('style')
}

// Two-stage reset: edits reset back to the preset, a second press clears the
// preset back to stock. Gated on `mounted` — the persisted theme is client-only
// and hydration would adopt a disabled= that never lifts.
const anyDirty = computed(() => mounted.value && Object.values(groupDirtyFlags).some(flag => flag.value))
const baselinePreset = computed(() => mounted.value ? presets.find(preset => preset.id === activePreset.value) : undefined)
const resetsToPreset = computed(() => Boolean(baselinePreset.value) && anyDirty.value)
const canReset = computed(() => anyDirty.value || Boolean(baselinePreset.value))
const resetLabel = computed(() => {
  if (resetsToPreset.value) return `Reset to ${baselinePreset.value!.name}`
  return baselinePreset.value ? 'Reset to Nuxt UI theme' : 'Reset theme'
})

function resetToBaseline() {
  if (resetsToPreset.value) applyPreset(baselinePreset.value!)
  else resetTheme()
}

defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo,
  ctrl_shift_d: toggleColorMode,
  // Enters fullscreen and toggles back out; Esc also exits (below). Auto-
  // suppressed while an input is focused, so it never eats a typed 'f'.
  f: () => (fullscreen.value = !fullscreen.value)
})

// Esc exits fullscreen — not via defineShortcuts, whose preventDefault would
// stop Reka's dismissable layers from ever seeing Escape. A plain listener
// defers while a layer is open, so Esc closes the popover first.
function onEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !fullscreen.value || event.defaultPrevented) return
  // only VISIBLE layers defer — closed overlays keep their marker in the DOM
  const layers = document.querySelectorAll('[data-dismissable-layer]')
  if ([...layers].some(layer => layer.getClientRects().length)) return
  fullscreen.value = false
}
onMounted(() => window.addEventListener('keydown', onEscape))

// Fullscreen must not leak past the studio. The pending capture flushes rather
// than dies — an edit inside the debounce window would vanish from history.
onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  fullscreen.value = false
  clearTimeout(captureTimeout)
  capture(snapshot())
})

// `style` stays the doc/section key; the label is what people read, and
// "Options" is honest about a panel holding type, scale and defaults too.
const settingGroups = [
  { label: 'Colors', value: 'colors' },
  { label: 'Options', value: 'style' }
] as const

// Fullscreen reveal via mousemove, not a hover overlay (it would eat clicks on
// the preview's bottom edge). The bar pins open while a panel is open — panel
// content portals to <body>, so hover alone would retract it under its popovers.
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

const openPanels = reactive({ presets: false, colors: false, style: false, view: false })
const toolbarPinned = computed(() => nearBottom.value || Object.values(openPanels).some(Boolean))

/** The shared import/export modal — the two toolbar buttons pick its mode. */
const shareOpen = ref(false)
const shareMode = ref<'import' | 'export'>('export')
</script>

<template>
  <!-- page tint composites on the app root's bg-default (nuxt.config rootAttrs) -->
  <main class="bg-elevated/25">
    <UContainer :class="fullscreen && 'max-w-none'" class="px-0 sm:px-0 lg:px-0">
      <!-- structured borders like /releases: border-x rails, no floating card -->
      <div class="flex flex-col w-full bg-default" :class="fullscreen ? 'h-dvh' : 'h-[calc(100dvh-var(--ui-header-height))] border-x border-default'">
        <!-- [contain:paint]: Chromium won't clip nested composited layers by
             an ancestor's overflow alone. Keyed on the icon pack: demo views
             resolve icons at setup, so a pack swap remounts to re-resolve. -->
        <div :key="iconSet" class="flex-1 min-h-0 overflow-hidden [&>*]:[contain:paint]">
          <Playground v-if="view === 'grid'" />
          <LazyThemeStudioViewDashboard v-else-if="view === 'dashboard'" />
          <LazyThemeStudioViewChat v-else-if="view === 'chat'" />
          <LazyThemeStudioViewSaas v-else-if="view === 'saas'" />
          <LazyThemeStudioViewLanding v-else-if="view === 'landing'" />
          <LazyThemeStudioViewDocs v-else-if="view === 'docs'" />
          <LazyThemeStudioViewPortfolio v-else-if="view === 'portfolio'" />
          <LazyThemeStudioViewChangelog v-else-if="view === 'changelog'" />
          <LazyThemeStudioViewEditor v-else-if="view === 'editor'" />
          <LazyThemeStudioViewA11y v-else-if="view === 'a11y'" />
        </div>

        <!-- In fullscreen the toolbar floats over the bottom edge at
             UContainer's own recipe (edges line up with other pages); only
             the strip catches the pointer so the preview stays clickable. -->
        <div :class="fullscreen ? 'group fixed bottom-0 inset-x-0 z-50 pointer-events-none w-full max-w-(--ui-container) mx-auto ' : 'shrink-0'">
          <!-- thin touch affordance only — mouse reveal is proximity-driven -->
          <div v-if="fullscreen" class="absolute bottom-0 inset-x-0 h-2 pointer-events-auto" />

          <div
            class="flex items-center gap-2 p-3 overflow-x-auto"
            :class="fullscreen ? [
              'mt-4 rounded-t-lg bg-default/75 backdrop-blur ring ring-default shadow-lg pointer-events-auto transition-transform duration-200',
              toolbarPinned ? 'translate-y-0' : 'translate-y-[calc(100%+6px)] group-hover:translate-y-0 group-focus-within:translate-y-0'
            ] : 'border-t border-default'"
          >
            <ThemeStudioPresetMenu v-model:open="openPanels.presets" keep-panels class="w-52 shrink-0" />

            <UPopover
              v-for="settingGroup in settingGroups"
              :key="settingGroup.value"
              v-model:open="openPanels[settingGroup.value]"
              :content="{ align: 'start', onInteractOutside: keepPanels }"
            >
              <UChip :show="groupDirtyFlags[settingGroup.value].value" color="primary" size="sm">
                <UButton
                  :label="settingGroup.label"
                  color="neutral"
                  variant="subtle"
                  :icon="settingGroup.value === 'colors' ? undefined : studioIcons.options"
                  :trailing-icon="appConfig.ui.icons.chevronDown"
                >
                  <!-- Colors leads with its own swatches instead of a glyph -->
                  <template v-if="settingGroup.value === 'colors'" #leading>
                    <!-- overlapped like an avatar stack; the ring is the
                         button's own surface, so it cuts rather than outlines -->
                    <span class="flex items-center -space-x-0.5">
                      <!-- black-as-primary has no ramp variable to point at -->
                      <span
                        v-for="(dot, index) in colorDots"
                        :key="index"
                        class="inline-block size-3 rounded-full ring-2 ring-(--ui-bg-elevated)"
                        :class="!dot && 'bg-black dark:bg-white'"
                        :style="dot ? { backgroundColor: dot } : undefined"
                      />
                    </span>
                  </template>
                </UButton>
              </UChip>

              <template #content>
                <ThemeStudioControls :group="settingGroup.value" class="w-80 max-h-[70vh] overflow-y-auto" />
              </template>
            </UPopover>

            <span class="flex-1" />

            <!-- desktop's switcher lives in the header; this one covers
                 mobile and fullscreen -->
            <ThemeStudioViewSwitcher
              v-model:open="openPanels.view"
              :content="{ align: 'end' }"
              class="shrink-0"
              :class="!fullscreen && 'lg:hidden'"
            />

            <UFieldGroup class="shrink-0">
              <UTooltip text="Undo" :kbds="['meta', 'Z']">
                <UButton
                  :icon="studioIcons.undo"
                  color="neutral"
                  variant="subtle"
                  :disabled="!past.length"
                  aria-label="Undo theme change"
                  @click="undo"
                />
              </UTooltip>

              <UTooltip text="Redo" :kbds="['meta', 'shift', 'Z']">
                <UButton
                  :icon="studioIcons.redo"
                  color="neutral"
                  variant="subtle"
                  :disabled="!future.length"
                  aria-label="Redo theme change"
                  @click="redo"
                />
              </UTooltip>
            </UFieldGroup>

            <UTooltip :text="resetLabel">
              <UButton
                :icon="studioIcons.reset"
                color="neutral"
                variant="subtle"
                :disabled="!canReset"
                :aria-label="resetLabel"
                @click="resetToBaseline"
              />
            </UTooltip>

            <div class="shrink-0">
              <UFieldGroup>
                <UTooltip text="Import theme">
                  <UButton
                    :icon="appConfig.ui.icons.upload"
                    color="neutral"
                    variant="subtle"
                    aria-label="Import theme"
                    @click="shareMode = 'import'; shareOpen = true"
                  />
                </UTooltip>

                <UButton
                  label="Export"
                  :icon="studioIcons.export"
                  color="neutral"
                  variant="subtle"
                  @click="shareMode = 'export'; shareOpen = true"
                />
              </UFieldGroup>
            </div>

            <UTooltip :text="fullscreen ? 'Exit fullscreen' : 'Fullscreen preview'" :kbds="fullscreen ? ['Esc'] : ['F']">
              <UButton
                :icon="fullscreen ? studioIcons.exitFullscreen : studioIcons.fullscreen"
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
