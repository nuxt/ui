<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const card = 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium'

const items: SplitterItem[] = [
  { slot: 'left', minSize: 15, defaultSize: 25, class: card },
  { slot: 'main', minSize: 30, defaultSize: 50, class: card },
  { slot: 'right', minSize: 15, defaultSize: 25, class: card }
]
</script>

<template>
  <div class="w-full h-96">
    <USplitter id="splitter-example" :items="items">
      <template #left>
        Left
      </template>

      <template #main>
        Main
      </template>

      <template #right>
        Right
      </template>
    </USplitter>
  </div>
</template>
