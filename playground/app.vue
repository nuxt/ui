<template>
  <UContainer class="min-h-screen flex items-center">
    <UCard class="flex-1" :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50', ring: 'ring-1 ring-gray-300 dark:ring-gray-700', divide: 'divide-y divide-gray-300 dark:divide-gray-700', header: { base: 'font-bold' } }">
      <template #header>
        Welcome to the playground!
      </template>
      
      <div class="text-gray-500 dark:text-gray-400 flex space-x-4 mb-48">
        <UButton label="Open slideOver" @click="isOpen = true" />
        
        <USelectMenu v-model="selected" :options="['left', 'right', 'bottom', 'top']" />


        <USlideover v-model="isOpen" :side="selected">
          <p class="p-4">
            My content INTO slide Over
          </p>
        </USlideover>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup>

const isOpen = ref(false)
const selected = ref('right')
</script>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
