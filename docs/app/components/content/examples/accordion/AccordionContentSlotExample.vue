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
    <template #content="{ item }">
      <p class="pb-3.5 text-sm text-[var(--ui-text-muted)]">
        This is the {{ item.label }} panel.
      </p>
    </template>
  </UAccordion>
</template>
