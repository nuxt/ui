<script setup lang="ts">
const items = Array.from({ length: 30 }, (_, i) => {
  const heights = [300, 400, 200, 450]
  return {
    id: i + 1,
    url: `https://picsum.photos/300/${heights[i % heights.length]}?random=${i}`,
    title: `Image ${i + 1}`
  }
})
</script>

<template>
  <UScrollArea
    :items="items"
    :virtualize="{
      estimateSize: 300,
      gap: 12,
      paddingStart: 12,
      paddingEnd: 12,
      laneWidth: 200,
      minLanes: 1,
      maxLanes: 6
    }"
    class="h-[600px] border border-default rounded-lg"
    style="resize: horizontal; overflow: auto; min-width: 300px; min-height: 300px;"
  >
    <template #default="{ item }">
      <UCard :ui="{ body: 'p-0 sm:p-0' }">
        <template #header>
          <h3 class="font-semibold text-sm">
            {{ item.title }}
          </h3>
        </template>
        <div class="bg-elevated overflow-hidden">
          <img
            :src="item.url"
            :alt="item.title"
            class="w-full h-full object-cover"
          >
        </div>
      </UCard>
    </template>
  </UScrollArea>
</template>
