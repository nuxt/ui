<script setup lang="ts">
import { iconSetSamples } from '../../utils/theme/icons'

/**
 * The icon set picker: the toolbar control itself, not a panel. The list is
 * already a popover, so wrapping it in another one just to hold a select was
 * a popover inside a popover.
 */
defineProps<{ tooltip?: string }>()

/** Exposed so the fullscreen toolbar can pin itself while the list is open. */
const open = defineModel<boolean>('open', { default: false })

const { icon, icons } = useTheme()
</script>

<template>
  <ThemeStudioListPicker
    v-model="icon"
    v-model:open="open"
    :items="icons"
    :icon="icons.find(entry => entry.value === icon)?.icon"
    :tooltip="tooltip"
    variant="outline"
    aria-label="Icon set"
  >
    <!-- every set previews a strip of its own glyphs -->
    <template #item-description="{ item }">
      <span class="flex items-center gap-1.5 pt-0.5">
        <UIcon
          v-for="name in iconSetSamples(item.value)"
          :key="name"
          :name="name"
          class="size-3.5 text-muted"
        />
      </span>
    </template>
  </ThemeStudioListPicker>
</template>
