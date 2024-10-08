<script setup lang="ts">
const items = [
  'https://picsum.photos/528/528?random=1',
  'https://picsum.photos/528/528?random=2',
  'https://picsum.photos/528/528?random=3',
  'https://picsum.photos/528/528?random=4',
  'https://picsum.photos/528/528?random=5',
  'https://picsum.photos/528/528?random=6'
]
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    class-names
    arrows
    :items="items"
    :ui="{
      item: 'basis-[70%] transition-opacity [&:not(.is-snapped)]:opacity-10'
    }"
    class="mx-auto max-w-sm"
  >
    <img :src="item" width="264" height="264" class="rounded-lg">
  </UCarousel>
</template>
