<script setup>
const items = [
  'https://picsum.photos/600/800?random=1',
  'https://picsum.photos/600/800?random=2',
  'https://picsum.photos/600/800?random=3',
  'https://picsum.photos/600/800?random=4',
  'https://picsum.photos/600/800?random=5',
  'https://picsum.photos/600/800?random=6'
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
