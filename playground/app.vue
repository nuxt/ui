<template>
  <UContainer class="min-h-screen flex items-center">
    <UCard class="flex-1" :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50', ring: 'ring-1 ring-gray-300 dark:ring-gray-700', divide: 'divide-y divide-gray-300 dark:divide-gray-700', header: { base: 'font-bold' } }">
      <template #header>
        Welcome to the playground!
      </template>

      <p class="text-gray-500 dark:text-gray-400">
        Try your components here!
      </p>
      <p>Count: {{ count }}</p>
      <button class="mt-4 px-2 ring-1 ring-gray-400 rounded" @click="reveal">
        Open modal
      </button>
    </UCard>
    <UModals />
  </UContainer>
</template>

<script setup lang="ts">
import { Test } from '#components'

const modal = useModal()

const count = ref(0)

function reveal () {
  // question: do we want the props to be reactive here ?
  modal.reveal(Test, {
    // UModal props
    fullscreen: true,
    // Test component props
    // count // Warning, this is an object and not a number. Reactive.
    count: count.value // Ok, but not reactive.
  })
  setTimeout(() => {
    modal.patch({
      fullscreen: false
    })
  }, 3000)
}

onMounted(() => {
  setInterval(() => {
    count.value += 1
  }, 1000)
})
</script>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
