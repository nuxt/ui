<script setup lang="ts">
const items = Array.from({ length: 1000 }).map((_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
  src: `https://picsum.photos/640/480?v=${index}`,
  width: 640,
  height: 480
}))

const gap = 16
const scrollArea = useTemplateRef('scrollArea')
const { width } = useElementSize(() => scrollArea.value?.$el)

const lanes = computed(() => Math.max(1, Math.min(4, Math.floor(width.value / 200))))
const laneWidth = computed(() => (width.value - (lanes.value - 1) * gap) / lanes.value)
const estimateSize = computed(() => laneWidth.value * (480 / 640))
</script>

<template>
  <UScrollArea
    ref="scrollArea"
    v-slot="{ item }"
    :items="items"
    :virtualize="{
      gap,
      lanes,
      estimateSize,
      skipMeasurement: true
    }"
    class="w-full h-96 p-4"
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
