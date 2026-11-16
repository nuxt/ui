<script setup lang="ts">
const items = [
  'https://picsum.photos/640/640?random=1',
  'https://picsum.photos/640/640?random=2',
  'https://picsum.photos/640/640?random=3',
  'https://picsum.photos/640/640?random=4',
  'https://picsum.photos/640/640?random=5',
  'https://picsum.photos/640/640?random=6'
]
</script>

<template>
  <UCarousel
    arrows
    dots
    :items="items"
    :ui="{
      dots: 'static flex-nowrap justify-between gap-1 pt-4',
      dot: 'size-11 rounded-lg bg-transparent data-[state=active]:bg-transparent opacity-25 hover:opacity-100 data-[state=active]:opacity-100 transition-opacity'
    }"
    class="w-full max-w-xs mx-auto"
  >
    <template #default="{ item }">
      <img :src="item" width="320" height="320" class="rounded-lg" loading="lazy">
    </template>

    <template #dot="{ index }">
      <img :src="items[index]" width="44" height="44" class="rounded-lg" loading="lazy">
    </template>
  </UCarousel>
</template>
