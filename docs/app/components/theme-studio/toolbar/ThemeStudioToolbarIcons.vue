<script setup lang="ts">
import { iconSetSamples } from '../../../utils/theme/icons'

/** The icon-pack select, every set previewing a strip of its own glyphs. */
defineProps<{ vertical?: boolean }>()

const { icon, icons } = useTheme()
const { groupDirtyFlags } = useThemeStudioToolbar()
</script>

<template>
  <ThemeStudioToolbarSelect
    v-model="icon"
    :items="icons"
    :icon="icons.find(entry => entry.value === icon)?.icon"
    :dirty="groupDirtyFlags.icons.value"
    aria-label="Icon set"
    :content-class="vertical ? undefined : 'w-72'"
    :class="vertical ? 'w-full' : 'w-38'"
  >
    <template #item-description="{ item }">
      <span class="flex items-center gap-1.5 pt-0.5">
        <UIcon
          v-for="name in iconSetSamples(String(item.value))"
          :key="name"
          :name="name"
          class="size-3.5 text-muted"
        />
      </span>
    </template>
  </ThemeStudioToolbarSelect>
</template>
