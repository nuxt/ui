<script setup lang="ts">
import type { ProgressGroupItem } from '@nuxt/ui'

const items: ProgressGroupItem[] = [
  { label: 'System', value: 24, color: 'neutral' },
  { label: 'Apps', value: 8, color: 'error' },
  { label: 'Documents', value: 12, color: 'warning' },
  { label: 'Multimedia', value: 42, color: 'success' }
]
</script>

<template>
  <UProgressGroup :items="items" :max="128" class="w-96">
    <template #item-label="{ item }">
      <span class="font-medium">{{ item.label }}</span>
    </template>

    <template #item-trailing="{ item }">
      {{ item.value }}GB
    </template>
  </UProgressGroup>
</template>
