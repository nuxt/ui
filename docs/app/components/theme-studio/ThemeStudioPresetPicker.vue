<script setup lang="ts">
/**
 * The header's theme popover trigger. The panel behind it is a lazy chunk:
 * this trigger rides the header onto every docs page, and the panel pulls
 * the whole theme engine (presets, palette math) with it, so none of that
 * loads until the popover first opens. The header drops this on /theme,
 * where the studio's own toolbar covers it.
 */
import { keepPanels, paletteLabel, PRESET_ICONS } from '../../utils/theme/studio'
import { DEFAULT_PRESET_ID } from '../../utils/theme/engine/types'

const { track } = useAnalytics()
const { activePreset } = useTheme()
const studioIcons = useStudioIcons()

// The persisted preset is client-only, resolve after mount so hydration
// matches the server's fallback.
const mounted = useMounted()

// The applied preset, none for the stock theme (or before mount). Its name
// and glyph are derived from the id rather than looked up in the presets
// table: the table is part of the engine chunk this trigger exists to keep
// out of the header. Preset ids are their names lowercased.
const presetId = computed(() => {
  const id = mounted.value ? activePreset.value : undefined
  return !id || id === DEFAULT_PRESET_ID ? undefined : id
})

const label = computed(() => (presetId.value ? capitalize(paletteLabel(presetId.value)) : 'Theme'))
const icon = computed(() => (presetId.value && PRESET_ICONS[presetId.value]) || studioIcons.palette)

const open = ref(false)

watch(open, (isOpen) => {
  if (isOpen) {
    track('Theme Picker Opened')
  }
})
</script>

<template>
  <UPopover
    v-model:open="open"
    :content="{ onInteractOutside: keepPanels }"
    :ui="{ content: 'w-62' }"
  >
    <!-- The applied preset already drives --ui-primary, so text-primary is
         its own color, the same the panel paints its chip in. -->
    <UButton
      :icon="icon"
      :label="label"
      color="neutral"
      variant="soft"
      :ui="{ leadingIcon: presetId ? 'text-primary' : '' }"
      aria-label="Theme"
    />

    <template #content>
      <LazyThemeStudioPresetPickerPanel @close="open = false" />
    </template>
  </UPopover>
</template>
