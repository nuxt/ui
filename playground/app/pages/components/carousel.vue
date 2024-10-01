<script setup lang="ts">
import theme from '#build/ui/navigation-menu'

const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('horizontal' as const)

const items = [
  { src: 'https://picsum.photos/600/600?random=1' },
  { src: 'https://picsum.photos/600/600?random=2' },
  { src: 'https://picsum.photos/600/600?random=3' },
  { src: 'https://picsum.photos/600/600?random=4' },
  { src: 'https://picsum.photos/600/600?random=5' },
  { src: 'https://picsum.photos/600/600?random=6' }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />

    <UCarousel v-slot="{ item }" :items="items" class="w-full max-w-xs">
      <img :src="item.src" width="300" height="300" class="rounded-lg">
    </UCarousel>
  </div>
</template>
