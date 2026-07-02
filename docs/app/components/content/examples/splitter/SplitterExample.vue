<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const items: SplitterItem[] = [
  { slot: 'first', min: 20, default: 30 },
  { slot: 'second' }
]
</script>

<template>
  <USplitter :items="items" class="h-96">
    <template #first>
      <Placeholder class="size-full" />
    </template>

    <template #second>
      <Placeholder class="size-full" />
    </template>
  </USplitter>
</template>
