<script setup lang="ts">
import { themeIcons, iconSetSamples } from '../../utils/theme'

/** The icon set picker, over a spread of the set it applies. */
const { icon, icons } = useTheme()

/** A representative spread from the selected set for the preview grid. */
const SAMPLE_ICON_KEYS = ['search', 'check', 'close', 'warning', 'error', 'info', 'tip', 'light', 'dark', 'external', 'plus', 'minus', 'loading', 'copy', 'file', 'folder', 'eye', 'star', 'upload', 'menu', 'ellipsis', 'reload', 'arrowRight', 'chevronDown']
const iconPreviews = computed(() => {
  const set = (themeIcons as Record<string, Record<string, string>>)[icon.value] || {}
  return SAMPLE_ICON_KEYS.map(key => set[key]).filter((name): name is string => !!name).slice(0, 20)
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- every set previews a strip of its own glyphs -->
    <ThemeStudioListPicker
      v-model="icon"
      :items="icons"
      :icon="icons.find(i => i.value === icon)?.icon"
      aria-label="Icon set"
    >
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

    <!-- a spread of the selected set -->
    <div class="rounded-md ring ring-default bg-elevated/50 px-3 py-2 flex flex-wrap justify-center gap-2.5">
      <UIcon v-for="name in iconPreviews" :key="name" :name="name" class="size-4 text-muted" />
    </div>
  </div>
</template>
