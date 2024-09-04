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
    <template #body="{ item }">
      This is the {{ item.label }} panel.
    </template>
  </UAccordion>
</template>
