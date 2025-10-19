<script setup lang="ts">
const items = Array.from({ length: 100 }, (_, i) => {
  const aspectRatios = ['1/1', '4/3', '16/9', '3/4']
  return {
    id: i + 1,
    url: `https://picsum.photos/300/${aspectRatios[i % aspectRatios.length] === '1/1' ? 300 : aspectRatios[i % aspectRatios.length] === '4/3' ? 400 : aspectRatios[i % aspectRatios.length] === '3/4' ? 450 : 200}?random=${i}`,
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
      lanes: 3
    }"
    class="h-[600px] w-full border border-default rounded-lg"
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
