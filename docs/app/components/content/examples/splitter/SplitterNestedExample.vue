<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const items: SplitterItem[] = [
  { slot: 'left', min: 20, default: 30 },
  { slot: 'right' }
]

const nested: SplitterItem[] = [
  { slot: 'top' },
  { slot: 'bottom' }
]
</script>

<template>
  <USplitter :items="items" class="h-96">
    <template #left>
      <Placeholder class="size-full" />
    </template>

    <template #right>
      <USplitter orientation="vertical" :items="nested" class="size-full">
        <template #top>
          <Placeholder class="size-full" />
        </template>

        <template #bottom>
          <Placeholder class="size-full" />
        </template>
      </USplitter>
    </template>
  </USplitter>
</template>
