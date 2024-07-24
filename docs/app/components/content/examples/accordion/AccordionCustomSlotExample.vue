<script setup lang="ts">
const items = [
  {
    label: 'Colors',
    icon: 'i-heroicons-swatch',
    slot: 'colors',
    content: 'Choose a primary and a gray color from your Tailwind CSS theme.'
  },
  {
    label: 'Icons',
    icon: 'i-heroicons-face-smile',
    content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    content: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
  }
]
</script>

<template>
  <UAccordion :items="items">
    <template #colors="{ item }">
      <p class="text-primary-500 dark:text-primary-400">
        {{ item.content }}
      </p>
    </template>
  </UAccordion>
</template>
