<script setup lang="ts">
const items = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`
}))
</script>

<template>
  <UScrollArea
    :items="items"
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
