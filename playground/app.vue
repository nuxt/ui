<script setup>
import image1 from './assets/1.jpg'
import image2 from './assets/2.jpg'
import image3 from './assets/3.jpg'
import image4 from './assets/4.jpg'
import image5 from './assets/5.jpg'
import image6 from './assets/6.jpg'

const items = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6
]

const isLTR = ref(true)
</script>


<template>
  <UContainer class="min-h-screen flex items-center" :dir="isLTR ? 'ltr' : 'rtl'">
    <UCard class="flex-1" :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50', ring: 'ring-1 ring-gray-300 dark:ring-gray-700', divide: 'divide-y divide-gray-300 dark:divide-gray-700', header: { base: 'font-bold' } }">
      <template #header>
        Welcome to the playground!
      </template>

      <UButton :label="`Direction: ${isLTR ? 'ltr' : 'rtl'}`" class="mb-4" @click="isLTR = !isLTR" />

      <UCarousel
        v-slot="{ item }"
        :items="items"
        :ui="{ item: 'basis-full' }"
        class="rounded-lg overflow-hidden"
        arrows
        indicators
      >
        <img :src="item" class="w-full" draggable="false">
      </UCarousel>
    </UCard>
  </UContainer>
</template>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
