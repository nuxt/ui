<script setup lang="ts">
const items = [
  'https://picsum.photos/400/600?random=1',
  'https://picsum.photos/400/600?random=2',
  'https://picsum.photos/400/600?random=3',
  'https://picsum.photos/400/600?random=4',
  'https://picsum.photos/400/600?random=5',
  'https://picsum.photos/400/600?random=6'
]
</script>

<template>
  <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'snap-end' }">
    <img :src="item" width="200" height="300" draggable="false">
  </UCarousel>
</template>
