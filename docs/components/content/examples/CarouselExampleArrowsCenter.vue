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
  <UCarousel
    v-slot="{ item }"
    :items="items"
    :ui="{
      item: 'basis-full',
      container: 'rounded-lg'
    }"
    :prev-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-left-20-solid',
      class: '-start-12'
    }"
    :next-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-right-20-solid',
      class: '-end-12'
    }"
    arrows
    class="w-64 mx-auto"
  >
    <img :src="item" class="w-full" draggable="false">
  </UCarousel>
</template>
