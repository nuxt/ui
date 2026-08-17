<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const card = 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-semibold'

const items: SplitterItem[] = [
  { slot: 'a', minSize: 20, class: card },
  { slot: 'bc', minSize: 20 }
]

const nested: SplitterItem[] = [
  { slot: 'b', minSize: 20, class: card },
  { slot: 'c', minSize: 20, class: card }
]
</script>

<template>
  <Navbar />

  <div class="flex-1 w-full">
    <USplitter id="splitter" orientation="horizontal" :items="items" class="size-full">
      <template #a>
        Panel A
      </template>

      <template #bc>
        <USplitter id="splitter-nested" orientation="vertical" :items="nested" class="size-full">
          <template #b>
            Panel B
          </template>

          <template #c>
            Panel C
          </template>
        </USplitter>
      </template>
    </USplitter>
  </div>
</template>
