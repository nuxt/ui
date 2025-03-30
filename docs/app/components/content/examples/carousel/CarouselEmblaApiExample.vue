<script setup lang="ts">
const items = [
  "https://picsum.photos/640/640?random=1",
  "https://picsum.photos/640/640?random=2",
  "https://picsum.photos/640/640?random=3",
  "https://picsum.photos/640/640?random=4",
  "https://picsum.photos/640/640?random=5",
  "https://picsum.photos/640/640?random=6",
];

const carousel = useTemplateRef("carousel");
const activeIndex = ref(0);

const next = (): void => {
  activeIndex.value++;
};

const prev = (): void => {
  activeIndex.value--;
};

const onSelect = (index: number) => {
  activeIndex.value = index;
  carousel.value?.emblaApi?.scrollTo(index);
};
</script>

<template>
  <div class="flex-1 w-full">
    <UCarousel
      ref="carousel"
      v-slot="{ item }"
      arrows
      :items="items"
      :prev="{ onClick: prev }"
      :next="{ onClick: next }"
      class="w-full max-w-xs mx-auto"
    >
      <img :src="item" width="320" height="320" class="rounded-lg" />
    </UCarousel>
    <div class="flex gap-2 justify-center pt-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="w-12 h-12 rounded-lg bg-neutral-200 opacity-25 hover:opacity-100"
        :class="{ 'opacity-100': activeIndex === index }"
        @click="onSelect(index)"
      >
        <img :src="item" width="120" height="120" class="rounded-lg" />
      </div>
    </div>
  </div>
</template>
