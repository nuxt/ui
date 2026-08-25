<script setup lang="ts">
const { track } = useAnalytics()
const { icon: iconSet, font } = useTheme()

// Toolbar skins to the applied icon pack; import/chevron reuse the standard
// semantic keys off appConfig.ui.icons.
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

const { view } = useThemeStudioView()
const { past, future, undo, redo } = useThemeStudioHistory()
const { colorChips, colorLabel, groupDirtyFlags, canReset, resetLabel, resetToBaseline } = useThemeStudioToolbar()

useThemeStudioRecorder()
useThemeStudioViewParam()

// The studio's preview is a card floating on a recessed canvas, which is the
// one background the semantic tokens can't express: `--ui-bg-*` only ever
// elevates, so there is no "behind the surface" step (v5's elevation ladder).
// Unhead drops the class on navigate, so the canvas stays on this page.
useHead({
  bodyAttrs: { class: 'theme-studio' }
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: 'Theme Studio',
  description: 'Customize Nuxt UI live: colors, radius, fonts and icons, then export only what you changed.'
})

onMounted(() => track('Theme Studio Opened'))

// Color mode rides the app-wide `d` binding in app.vue, no page copy needed.
defineShortcuts({
  meta_z: undo,
  meta_shift_z: redo,
  ctrl_y: redo
})

const openPanels = reactive({ presets: false, colors: false, font: false, icons: false, radius: false, style: false, view: false })

/** The shared import/export modal, the two toolbar buttons pick its mode. */
const shareOpen = ref(false)
const shareMode = ref<'import' | 'export'>('export')
</script>

<template>
  <!-- page tint composites on the app root's bg-default (nuxt.config rootAttrs) -->
  <main class="max-w-(--ui-container) mx-auto">
    <UHeader :ui="{ root: () => 'h-(--ui-header-height)' }">
      <template #left>
        <HeaderLogo />
      </template>

      <ThemeStudioViewSwitcher v-model:open="openPanels.view" :content="{ align: 'end' }" variant="soft" />

      <template #right>
        <UTooltip text="Color mode" :kbds="['d']">
          <UColorModeButton color="neutral" variant="ghost" data-keep-panels class="shrink-0" />
        </UTooltip>
      </template>
    </UHeader>

    <div class="flex flex-col bg-default rounded-xl overflow-hidden shadow ring ring-default h-[calc(100dvh-var(--ui-header-height)-var(--ui-header-height))] mx-2">
      <!-- [contain:paint]: Chromium won't clip nested composited layers by
             an ancestor's overflow alone. Keyed on the icon pack: demo views
             resolve icons at setup, so a pack swap remounts to re-resolve. -->
      <div :key="iconSet" class="flex-1 min-h-0 overflow-hidden *:contain-[paint]">
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
    </div>

    <UFooter>
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

      <ThemeStudioToolbarPopover
        v-model:open="openPanels.font"
        label="Text"
        :icon="studioIcons.text"
        :value="font"
        :dirty="groupDirtyFlags.font.value"
      >
        <ThemeStudioFontOptions />
      </ThemeStudioToolbarPopover>

      <!-- the picker is already a popover, so it sits in the bar directly
                 rather than inside a second one -->
      <ThemeStudioToolbarField v-slot="{ tooltip }" label="Icons">
        <ThemeStudioIconOptions v-model:open="openPanels.icons" :tooltip="tooltip" :dirty="groupDirtyFlags.icons.value" class="w-38" />
      </ThemeStudioToolbarField>

      <ThemeStudioToolbarField v-slot="{ tooltip }" label="Radius">
        <ThemeStudioRadiusOptions v-model:open="openPanels.radius" :tooltip="tooltip" :dirty="groupDirtyFlags.radius.value" class="w-34" />
      </ThemeStudioToolbarField>

      <ThemeStudioToolbarPopover
        v-model:open="openPanels.style"
        label="Defaults"
        :icon="studioIcons.options"
        :dirty="groupDirtyFlags.defaults.value"
      >
        <ThemeStudioControls group="style" class="w-80 max-h-[70vh] overflow-y-auto" />
      </ThemeStudioToolbarPopover>

      <ThemeStudioShuffleButton />

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
    </UFooter>

    <ThemeStudioShareModal v-model:open="shareOpen" v-model:mode="shareMode" />
  </main>
</template>
