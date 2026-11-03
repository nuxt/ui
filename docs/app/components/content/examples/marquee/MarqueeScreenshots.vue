<template>
  <div class="relative w-full h-100 bg-tint overflow-hidden">
    <UMarquee reverse orientation="vertical" :overlay="false" class="[--duration:40s] absolute w-115 -left-25 -top-75 h-235 transform-3d rotate-x-55 rotate-y-0 rotate-z-30">
      <img
        v-for="i in 4"
        :key="i"
        :src="`/blocks/image${i}.png`"
        width="460"
        height="258"
        :alt="`Nuxt UI Screenshot ${i}`"
        loading="lazy"
        class="aspect-video border border-default rounded-lg bg-white"
      >
    </UMarquee>
    <UMarquee orientation="vertical" :overlay="false" class="[--duration:40s] absolute w-115 -top-100 left-120 h-290 transform-3d rotate-x-55 rotate-y-0 rotate-z-30">
      <img
        v-for="i in [5, 6, 7, 8]"
        :key="i"
        :src="`/blocks/image${i}.png`"
        width="460"
        height="258"
        :alt="`Nuxt UI Screenshot ${i}`"
        loading="lazy"
        class="aspect-video border border-default rounded-lg bg-white"
      >
    </UMarquee>
    <UMarquee reverse orientation="vertical" :overlay="false" class="hidden md:flex [--duration:40s] absolute w-115 -top-75 left-255 h-265 transform-3d rotate-x-55 rotate-y-0 rotate-z-30">
      <img
        v-for="i in [9, 10, 11, 12]"
        :key="i"
        :src="`/blocks/image${i}.png`"
        width="460"
        height="258"
        :alt="`Nuxt UI Screenshot ${i}`"
        loading="lazy"
        class="aspect-video border border-default rounded-lg bg-white"
      >
    </UMarquee>
  </div>
</template>
