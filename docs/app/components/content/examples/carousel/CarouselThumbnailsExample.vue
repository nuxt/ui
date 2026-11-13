<script setup lang="ts">
const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/640?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/640/640?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/640?random=6'
]

const activeIndex = ref(0)
</script>

<template>
  <div class="flex-1 w-full">
    <UCarousel
      v-slot="{ item }"
      v-model="activeIndex"
      arrows
      :items="items"
      class="w-full max-w-xs mx-auto"
    >
      <img :src="item" width="320" height="320" class="rounded-lg" loading="lazy">
    </UCarousel>

    <div class="flex gap-1 justify-between pt-4 max-w-xs mx-auto">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="size-11 opacity-25 hover:opacity-100 transition-opacity"
        :class="{ 'opacity-100': activeIndex === index }"
        @click="activeIndex = index"
      >
        <img :src="item" width="44" height="44" class="rounded-lg" loading="lazy">
      </div>
    </div>
  </div>
</template>
