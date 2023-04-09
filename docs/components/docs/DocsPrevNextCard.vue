<template>
  <NuxtLink :to="to" class="block px-5 py-8 text-gray-700 not-prose border rounded-xl u-border-gray-200 dark:text-gray-300 group hover:border-primary-500 dark:hover:border-primary-400">
    <div v-if="icon" class="inline-flex items-center rounded-full p-1.5 bg-gray-50 dark:bg-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-400/10 ring-1 u-ring-gray-300 mb-4 group-hover:ring-primary-500 dark:group-hover:ring-primary-400 transition-colors">
      <UIcon :name="icon" class="w-5 h-5 u-text-gray-900 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
    </div>

    <p class="u-text-gray-900 font-medium text-[15px] mb-1">
      {{ title }}
    </p>

    <p v-if="$slots.default" class="text-sm font-normal u-text-gray-500 line-clamp-2">
      <ContentSlot :use="$slots.default" />
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
  to: {
    type: String,
    required: true
  }
})
</script>
