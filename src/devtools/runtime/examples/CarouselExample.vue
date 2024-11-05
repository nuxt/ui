<template>
  <UCarousel
    v-slot="{ item }"
    class="basis-1/3"
    :items="[
      'https://picsum.photos/320/320?v=1',
      'https://picsum.photos/320/320?v=2',
      'https://picsum.photos/320/320?v=3'
    ]"
  >
    <img :src="item" class="rounded-lg basis-1/3">
  </UCarousel>
</template>
