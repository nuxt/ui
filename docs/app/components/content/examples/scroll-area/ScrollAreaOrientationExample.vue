<script setup lang="ts">
defineProps<{
  orientation?: 'vertical' | 'horizontal'
}>()

const items = Array.from({ length: 30 }, (_, i) => ({
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
    :class="orientation === 'vertical' ? 'h-96 flex flex-col' : 'w-full'"
    class="border border-default rounded-lg"
  >
    <UCard>
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
