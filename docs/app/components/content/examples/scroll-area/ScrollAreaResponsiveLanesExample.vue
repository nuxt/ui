<script setup lang="ts">
const items = Array.from({ length: 1000 }).map((_, index) => ({
  id: index,
  title: `Item ${index + 1}`,
  src: `https://picsum.photos/640/480?v=${index}`,
  width: 640,
  height: 480
}))

const container = useTemplateRef('container')
const { width } = useElementSize(container)

const lanes = computed(() => Math.max(1, Math.min(4, Math.floor(width.value / 200))))
</script>

<template>
  <div ref="container" class="w-full">
    <UScrollArea
      v-slot="{ item }"
      :items="items"
      :virtualize="{
        lanes,
        estimateSize: 148,
        gap: 16
      }"
      class="h-96 p-4"
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
  </div>
</template>
