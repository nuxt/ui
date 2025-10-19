<script setup lang="ts">
const images = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: `https://picsum.photos/300/200?random=${i}`,
  title: `Image ${i + 1}`
}))
</script>

<template>
  <UScrollArea
    :items="images"
    orientation="horizontal"
    class="w-full border border-default rounded-lg p-4"
  >
    <template #default="{ item }">
      <div class="grid grid-rows-[1fr_min-content] h-full">
        <img
          :src="item.url"
          :alt="item.title"
          class="w-[300px] h-[200px] rounded-lg object-cover"
        >
        <p class="mt-2 text-sm text-center">
          {{ item.title }}
        </p>
      </div>
    </template>
  </UScrollArea>
</template>
