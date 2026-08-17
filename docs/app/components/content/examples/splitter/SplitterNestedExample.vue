<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const card = 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium'

const items: SplitterItem[] = [
  { slot: 'left', minSize: 20, class: card },
  { slot: 'right', minSize: 20 }
]

const nested: SplitterItem[] = [
  { slot: 'top', minSize: 20, class: card },
  { slot: 'bottom', minSize: 20, class: card }
]
</script>

<template>
  <div class="w-full h-96">
    <USplitter :items="items">
      <template #left>
        Left
      </template>

      <template #right>
        <USplitter orientation="vertical" :items="nested" class="size-full">
          <template #top>
            Top
          </template>

          <template #bottom>
            Bottom
          </template>
        </USplitter>
      </template>
    </USplitter>
  </div>
</template>
