<script setup lang="ts">
const { track } = useAnalytics()
const { icon: iconSet, font, icons } = useTheme()

// Toolbar skins to the applied icon pack; import/chevron reuse the standard
// semantic keys off appConfig.ui.icons.
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

// App-level: the site header hosts the view switcher and hides in fullscreen.
const { view } = useThemeStudioView()
const { fullscreen, nearBottom } = useThemeStudioFullscreen()
const { past, future, undo, redo } = useThemeStudioHistory()
const { colorChips, colorLabel, groupDirtyFlags, canReset, resetLabel, resetToBaseline } = useThemeStudioToolbar()

useThemeStudioRecorder()
useThemeStudioViewParam()

useSeoMeta({
  title: 'Theme Studio',
  description: 'Customize Nuxt UI live: colors, radius, fonts and icons, then export only what you changed.'
})

onMounted(() => track('Theme Studio Opened'))

const iconSetItem = computed(() => icons.find(entry => entry.value === iconSet.value))

// ⌃⇧D: bare Shift+D is a screen-reader landmark key, and macOS fires ⌘⇧D/⌘⇧L
// menu bindings at the NSMenu level where pages can't block them, control
// chords are the safe zone.
const colorMode = useColorMode()

defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo,
  ctrl_shift_d: () => (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'),
  // Enters fullscreen and toggles back out; Esc also exits. Auto-suppressed
  // while an input is focused, so it never eats a typed 'f'.
  f: () => (fullscreen.value = !fullscreen.value)
})

// The bar pins open while a panel is open, panel content portals to <body>,
// so hover alone would retract it under its own popovers.
const openPanels = reactive({ presets: false, colors: false, font: false, icons: false, style: false, view: false })
const toolbarPinned = computed(() => nearBottom.value || Object.values(openPanels).some(Boolean))

/** The shared import/export modal, the two toolbar buttons pick its mode. */
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
        <div :class="fullscreen ? 'group fixed bottom-0 inset-x-0 z-50 pointer-events-none w-full max-w-(--ui-container) mx-auto' : 'shrink-0'">
          <!-- thin touch affordance only, mouse reveal is proximity-driven -->
          <div v-if="fullscreen" class="absolute bottom-0 inset-x-0 h-2 pointer-events-auto" />

          <div
            class="flex items-end gap-2 p-3 overflow-x-auto"
            :class="fullscreen ? [
              'mt-4 rounded-t-lg bg-default/75 backdrop-blur ring ring-default shadow-lg pointer-events-auto transition-transform duration-200',
              toolbarPinned ? 'translate-y-0' : 'translate-y-[calc(100%+6px)] group-hover:translate-y-0 group-focus-within:translate-y-0'
            ] : 'border-t border-default'"
          >
            <ThemeStudioToolbarField v-slot="{ tooltip }" label="Preset">
              <ThemeStudioPresetMenu v-model:open="openPanels.presets" keep-panels :tooltip="tooltip" class="w-38" />
            </ThemeStudioToolbarField>

            <ThemeStudioToolbarPopover
              v-model:open="openPanels.colors"
              label="Colors"
              :value="colorLabel"
              :dirty="groupDirtyFlags.colors.value"
            >
              <template #leading>
                <span class="flex items-center -space-x-0.5">
                  <!-- primary stacks on top; black-as-primary has no ramp
                       variable to point at -->
                  <span
                    v-for="(chip, index) in colorChips"
                    :key="chip.label"
                    class="relative size-3 rounded-full ring-2 ring-(--ui-bg-elevated)"
                    :class="!chip.dot && 'bg-black dark:bg-white'"
                    :style="{ ...(chip.dot ? { backgroundColor: chip.dot } : {}), zIndex: colorChips.length - index }"
                  />
                </span>
              </template>

              <ThemeStudioControls group="colors" class="w-80 max-h-[70vh] overflow-y-auto" />
            </ThemeStudioToolbarPopover>

            <!-- the value names the control; the popover holds the section
                 that used to sit in the Options panel -->
            <ThemeStudioToolbarPopover v-model:open="openPanels.font" label="Font" icon="i-lucide-type" :value="font">
              <ThemeStudioFontOptions class="w-80 p-4" />
            </ThemeStudioToolbarPopover>

            <ThemeStudioToolbarPopover v-model:open="openPanels.icons" label="Icons" :icon="iconSetItem?.icon" :value="iconSetItem?.label">
              <ThemeStudioIconOptions class="w-80 p-4" />
            </ThemeStudioToolbarPopover>

            <ThemeStudioToolbarPopover
              v-model:open="openPanels.style"
              label="Options"
              :icon="studioIcons.options"
              :dirty="groupDirtyFlags.style.value"
            >
              <ThemeStudioControls group="style" class="w-80 max-h-[70vh] overflow-y-auto" />
            </ThemeStudioToolbarPopover>

            <ThemeStudioShuffleButton />

            <span class="flex-1" />

            <!-- desktop's switcher lives in the header; this one covers
                 mobile and fullscreen -->
            <ThemeStudioToolbarField v-slot="{ tooltip }" label="Preview" :class="!fullscreen && 'lg:hidden'">
              <ThemeStudioViewSwitcher v-model:open="openPanels.view" :content="{ align: 'end' }" :tooltip="tooltip" variant="outline" />
            </ThemeStudioToolbarField>

            <!-- fullscreen hides the header, and with it the only way to
                 flip the mode a theme is being judged in -->
            <UTooltip v-if="fullscreen" text="Color mode" :kbds="['ctrl', 'shift', 'D']">
              <UColorModeButton color="neutral" variant="outline" data-keep-panels class="shrink-0" />
            </UTooltip>

            <UFieldGroup class="shrink-0">
              <UTooltip text="Undo" :kbds="['meta', 'Z']">
                <UButton
                  :icon="studioIcons.undo"
                  color="neutral"
                  variant="outline"
                  :disabled="!past.length"
                  aria-label="Undo theme change"
                  @click="undo"
                />
              </UTooltip>

              <UTooltip text="Redo" :kbds="['meta', 'shift', 'Z']">
                <UButton
                  :icon="studioIcons.redo"
                  color="neutral"
                  variant="outline"
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
                variant="outline"
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
                    variant="outline"
                    aria-label="Import theme"
                    @click="shareMode = 'import'; shareOpen = true"
                  />
                </UTooltip>

                <UButton
                  label="Export"
                  :icon="studioIcons.export"
                  color="neutral"
                  variant="outline"
                  @click="shareMode = 'export'; shareOpen = true"
                />
              </UFieldGroup>
            </div>

            <UTooltip :text="fullscreen ? 'Exit fullscreen' : 'Fullscreen preview'" :kbds="fullscreen ? ['Esc'] : ['F']">
              <UButton
                :icon="fullscreen ? studioIcons.exitFullscreen : studioIcons.fullscreen"
                color="neutral"
                variant="outline"
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
