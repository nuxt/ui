<script setup lang="ts">
import { iconSetSamples } from '../../utils/theme'

/** The icon set picker: every set previews a strip of its own glyphs. */
withDefaults(defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}>(), {
  size: 'sm'
})

const { icon, icons } = useTheme()
</script>

<template>
  <ThemeStudioListPicker
    v-model="icon"
    :items="icons"
    :icon="icons.find(entry => entry.value === icon)?.icon"
    :size="size"
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
</template>
