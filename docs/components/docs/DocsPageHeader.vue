<template>
  <header class="relative border-b u-border-gray-200 pb-8 mb-12">
    <p class="mb-4 text-sm leading-6 font-semibold text-primary-500 dark:text-primary-400 capitalize">
      {{ useLowerCase(page._dir) }}
    </p>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight dark:text-gray-200">
      {{ page.title }}
    </h1>
    <p v-if="page.description" class="mt-4 text-lg text-gray-700 dark:text-gray-400">
      {{ page.description }}
    </p>
  </header>
</template>

<script setup lang="ts">
const { page } = useContent()
</script>
