<script setup lang="ts">
import { themeChipStyle, PRESET_ICONS } from '../../utils/theme/studio'
import { presets } from '../../utils/theme/engine/presets'
import type { ThemePreset } from '../../utils/theme/engine/presets'

/**
 * The presets under the hero file: a click retypes the pane above and
 * repaints the page under it. The presets come from their data module and
 * the studio itself loads on the first click, so the landing chunk carries
 * neither the palette math nor the section engine.
 */
const { selectedPreset } = useTheme()
const studioIcons = useStudioIcons()
const nuxtApp = useNuxtApp()

async function applyPreset(preset: ThemePreset) {
  const { useThemeStudio } = await import('../../composables/useThemeStudio')
  nuxtApp.runWithContext(() => useThemeStudio().applyPreset(preset))
}

// the applied preset is client-only, resolve after mount so hydration matches
const mounted = useThemeMounted()
const activePreset = computed(() => mounted.value ? selectedPreset.value : 'default')

// Each preset wears the chip the theme menu gives it: its glyph in its own
// primary, on that primary dimmed to a tint.
const pills = computed(() => presets.map(preset => ({
  id: preset.id,
  label: preset.name,
  avatar: {
    icon: PRESET_ICONS[preset.id] || studioIcons.palette,
    class: 'bg-(image:--chip-bg-light) dark:bg-(image:--chip-bg-dark)',
    style: themeChipStyle(preset.doc),
    ui: { icon: 'text-(--chip-icon-light) dark:text-(--chip-icon-dark)' }
  },
  active: activePreset.value === preset.id,
  apply: () => applyPreset(preset)
})))
</script>

<template>
  <div class="flex flex-wrap items-center gap-px px-1" role="group" aria-label="Theme preset">
    <UTooltip v-for="pill in pills" :key="pill.id" :text="pill.label" :delay-duration="0">
      <UButton
        :avatar="pill.avatar"
        color="neutral"
        variant="ghost"
        active-color="primary"
        active-variant="soft"
        size="md"
        :active="pill.active"
        :aria-pressed="pill.active"
        :aria-label="`${pill.label} theme`"
        class="p-1"
        @click="pill.apply()"
      />
    </UTooltip>
  </div>
</template>
