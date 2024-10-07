<script setup lang="ts">
const items = [
  {
    label: 'Icons',
    icon: 'i-heroicons-face-smile'
  },
  {
    label: 'Colors',
    icon: 'i-heroicons-swatch'
  },
  {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent'
  }
]
</script>

<template>
  <UAccordion :items="items">
    <template #content="{ item }">
      <p class="pb-3.5 text-sm text-[--ui-text-muted]">
        This is the {{ item.label }} panel.
      </p>
    </template>
  </UAccordion>
</template>
