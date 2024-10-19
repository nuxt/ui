<script setup lang="ts">
const items = [
  {
    label: 'Icons',
    icon: 'i-heroicons-face-smile',
    content: 'You have nothing to do, @nuxt/icon will handle it automatically.'
  },
  {
    label: 'Colors',
    icon: 'i-heroicons-swatch',
    slot: 'colors',
    content: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
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
      <p class="text-sm pb-3.5 text-[var(--ui-primary)]">
        {{ item.content }}
      </p>
    </template>
  </UAccordion>
</template>
