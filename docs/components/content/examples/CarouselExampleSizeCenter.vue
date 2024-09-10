<script setup lang="ts">
const items = [
  'https://picsum.photos/600/800?random=1',
  'https://picsum.photos/600/800?random=2',
  'https://picsum.photos/600/800?random=3',
  'https://picsum.photos/600/800?random=4',
  'https://picsum.photos/600/800?random=5',
  'https://picsum.photos/600/800?random=6'
]
</script>

<template>
  <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-full' }" class="w-64 mx-auto rounded-lg overflow-hidden">
    <img :src="item" class="w-full" draggable="false">
  </UCarousel>
</template>
