<script setup lang="ts">
withDefaults(defineProps<{
  orientation?: 'vertical' | 'horizontal'
  lanes?: number
  gap?: number
}>(), {
  orientation: 'vertical',
  lanes: 3,
  gap: 16
})

const heights = [320, 480, 640, 800]

function getHeight(index: number) {
  const seed = (index * 11 + 7) % 17
  return heights[seed % heights.length]!
}

const items = Array.from({ length: 1000 }).map((_, index) => {
  const height = getHeight(index)

  return {
    id: index,
    title: `Item ${index + 1}`,
    src: `https://picsum.photos/640/${height}?v=${index}`,
    width: 640,
    height
  }
})
</script>

<template>
  <UScrollArea
    v-slot="{ item }"
    :items="items"
    :orientation="orientation"
    :virtualize="{
      gap,
      lanes,
      estimateSize: 480
    }"
    class="w-full h-128 p-4"
  >
    <img
      :src="item.src"
      :alt="item.title"
      :width="item.width"
      :height="item.height"
      loading="lazy"
      class="rounded-md size-full object-cover"
    >
  </UScrollArea>
</template>
