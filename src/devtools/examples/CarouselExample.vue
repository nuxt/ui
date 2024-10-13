<template>
  <UCarousel
    v-slot="{ item }"
    :items="[
      'https://picsum.photos/320/320?v=1',
      'https://picsum.photos/320/320?v=2',
      'https://picsum.photos/320/320?v=3'
    ]"
    :ui="{ item: 'basis-1/3' }"
    class="w-full max-w-xs mx-auto"
  >
    <img :src="item" class="rounded-lg">
  </UCarousel>
</template>
