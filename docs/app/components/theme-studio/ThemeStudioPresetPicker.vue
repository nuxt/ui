<script setup lang="ts">
/**
 * The header's theme popover trigger. The panel behind it is a lazy chunk:
 * this trigger rides the header onto every docs page, and the panel pulls
 * the whole theme engine (presets, palette math) with it, so none of that
 * loads until the popover first opens. The header drops this on /theme,
 * where the studio's own toolbar covers it.
 */
import { keepPanels } from '../../utils/theme/studio'

const { track } = useAnalytics()
const studioIcons = useStudioIcons()

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
    :ui="{ content: 'w-60' }"
  >
    <UTooltip text="Theme">
      <UButton
        :icon="studioIcons.themes"
        color="neutral"
        :variant="open ? 'soft' : 'ghost'"
        square
        aria-label="Theme"
      />
    </UTooltip>

    <template #content>
      <LazyThemeStudioPresetPickerPanel @close="open = false" />
    </template>
  </UPopover>
</template>
