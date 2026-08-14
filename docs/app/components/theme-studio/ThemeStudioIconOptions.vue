<script setup lang="ts">
import { themeIcons, iconSetSamples } from '../../utils/theme'

/**
 * The icon set picker: the toolbar control itself, not a panel. The list is
 * already a popover, so wrapping it in another one just to hold a select was
 * a popover inside a popover.
 */
defineProps<{ tooltip?: string }>()

/** Exposed so the fullscreen toolbar can pin itself while the list is open. */
const open = defineModel<boolean>('open', { default: false })

const { icon, icons } = useTheme()

const SAMPLE_ICON_KEYS = ['search', 'check', 'close', 'warning', 'error', 'info', 'tip', 'light', 'dark', 'external', 'plus', 'minus', 'loading', 'copy', 'file', 'folder', 'eye', 'star', 'upload', 'menu', 'ellipsis', 'reload', 'arrowRight', 'chevronDown']
const iconPreviews = computed(() => {
  const set = (themeIcons as Record<string, Record<string, string>>)[icon.value] || {}
  return SAMPLE_ICON_KEYS.map(key => set[key]).filter((name): name is string => !!name).slice(0, 20)
})
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
    <!-- the applied set spread wide, above the alternatives -->
    <template #header>
      <div class="flex flex-wrap justify-center gap-2.5 px-3 py-2.5 border-b border-default">
        <UIcon v-for="name in iconPreviews" :key="name" :name="name" class="size-4 text-muted" />
      </div>
    </template>

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
