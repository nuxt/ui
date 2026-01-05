<script setup lang="ts">
defineProps<{
  orientation?: 'vertical' | 'horizontal'
}>()

const items = computed(() => Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`
})))
</script>

<template>
  <UScrollArea
    v-slot="{ item, index }"
    :items="items"
    :orientation="orientation"
    virtualize
    class="w-full data-[orientation=vertical]:h-96 data-[orientation=horizontal]:h-24.5"
  >
    <UPageCard
      v-bind="item"
      :variant="index % 2 === 0 ? 'soft' : 'outline'"
      class="rounded-none"
    />
  </UScrollArea>
</template>
