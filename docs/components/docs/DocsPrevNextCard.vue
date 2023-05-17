<template>
  <NuxtLink :to="to" class="block px-5 py-8 text-gray-700 transition-shadow bg-white border shadow not-prose rounded-xl border-gray-200 dark:border-gray-800 dark:bg-gray-800/25 hover:shadow-md dark:text-gray-300 dark:shadow-black/50 group">
    <div v-if="icon" class="inline-flex items-center rounded-full p-1.5 bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-400/10 ring-1 ring-gray-300 dark:ring-gray-700 mb-4 group-hover:ring-primary-400/50 transition-colors">
      <UIcon :name="icon" class="w-5 h-5 transition-colors text-gray-900 dark:text-gray-100 group-hover:text-primary-400" />
    </div>

    <p class="text-gray-900 dark:text-gray-50 font-medium text-[15px] mb-1">
      {{ title }}
    </p>

    <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  to: {
    type: String,
    required: true
  }
})
</script>
