<script setup lang="ts">
const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Card ${i + 1}`,
  description: i % 3 === 0
    ? `This is a longer description with more text to demonstrate variable height handling in virtualized lists. Item ${i + 1} has significantly more content than others.`
    : `Short description for item ${i + 1}.`
}))
</script>

<template>
  <UScrollArea
    :items="items"
    :virtualize="{ estimateSize: 120 }"
    class="h-96 w-full border border-default rounded-lg p-4"
  >
    <template #default="{ item }">
      <UCard class="mb-4">
        <template #header>
          <h3 class="font-semibold">
            {{ item.title }}
          </h3>
        </template>
        <p class="text-sm text-muted">
          {{ item.description }}
        </p>
      </UCard>
    </template>
  </UScrollArea>
</template>
