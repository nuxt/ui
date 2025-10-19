<script setup lang="ts">
const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `This is item ${i + 1} in a list of 10,000 items`
}))
</script>

<template>
  <UScrollArea
    :items="largeDataset"
    virtualize
    class="h-96 w-full border border-default rounded-lg p-4"
  >
    <template #default="{ item, index }">
      <div class="p-3 mb-2 bg-elevated rounded-lg">
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ item.title }}</span>
          <span class="text-xs text-muted">Index: {{ index }}</span>
        </div>
        <p class="text-sm text-muted mt-1">
          {{ item.description }}
        </p>
      </div>
    </template>
  </UScrollArea>
</template>
