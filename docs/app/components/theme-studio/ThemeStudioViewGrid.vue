<script setup lang="ts">
import type { ThemeStudioViewTab } from '~/composables/useThemeStudioView'

defineProps<{
  items: ThemeStudioViewTab[]
}>()

const emit = defineEmits<{ select: [] }>()

const { view } = useThemeStudioView()
</script>

<template>
  <!-- a 2-column card grid: each view is its /templates screenshot over
       label + blurb; the studio-only views (grid, a11y) get an icon tile.
       Scrolling belongs to the switcher wrapping the grids, so both
       sections move together. -->
  <UListbox
    v-model="view"
    :items="items"
    value-key="value"
    :ui="{
      root: 'ring-0 rounded-none overflow-visible',
      content: 'max-h-none overflow-visible',
      group: 'p-0 grid grid-cols-2 gap-1',
      item: 'flex-col rounded-lg ring-inset data-[state=checked]:bg-elevated/50',
      itemDescription: 'whitespace-normal line-clamp-2 text-xs',
      itemTrailing: 'hidden',
      itemWrapper: 'p-1'
    }"
    @update:model-value="emit('select')"
  >
    <template #item-leading="{ item }">
      <UColorModeImage
        v-if="item.image"
        :light="`${item.image}-light.png`"
        :dark="`${item.image}-dark.png`"
        :alt="`${item.label} preview`"
        width="654"
        height="368"
        loading="lazy"
        class="w-full aspect-video rounded-sm ring ring-default"
      />
      <span v-else class="w-full aspect-video rounded-sm ring ring-default bg-elevated/50 flex items-center justify-center">
        <UIcon :name="item.icon" class="size-6 text-muted" />
      </span>
    </template>
  </UListbox>
</template>
