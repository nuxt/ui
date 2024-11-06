<script setup lang="ts">
const items = [
  {
    label: 'Icons',
    icon: 'i-lucide-smile'
  },
  {
    label: 'Colors',
    icon: 'i-lucide-swatch-book'
  },
  {
    label: 'Components',
    icon: 'i-lucide-box'
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
