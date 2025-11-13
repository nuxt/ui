<script setup lang="ts">
defineProps<{
  orientation?: 'vertical' | 'horizontal'
  virtualize?: boolean
  lanes?: number
  gap?: number
  padding?: number
}>()

const items = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`
}))
</script>

<template>
  <UScrollArea
    v-slot="{ item }"
    :items="items"
    :orientation="orientation"
    :virtualize="virtualize ? {
      lanes: lanes && lanes > 1 ? lanes : undefined,
      gap,
      paddingStart: padding,
      paddingEnd: padding
    } : false"
    class="h-96 w-full border border-default rounded-lg"
  >
    <UCard class="h-full overflow-hidden">
      <template #header>
        <h3 class="font-semibold">
          {{ item.title }}
        </h3>
      </template>
      <p class="text-sm text-muted">
        {{ item.description }}
      </p>
    </UCard>
  </UScrollArea>
</template>
