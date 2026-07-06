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
  <div class="w-full h-96">
    <USplitter :items="items">
      <template #left>
        <Placeholder class="size-full" />
      </template>

      <template #right>
        <USplitter orientation="vertical" :items="nested">
          <template #top>
            <Placeholder class="size-full" />
          </template>

          <template #bottom>
            <Placeholder class="size-full" />
          </template>
        </USplitter>
      </template>
    </USplitter>
  </div>
</template>
