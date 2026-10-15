<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const items: SplitterItem[] = [
  { slot: 'left', minSize: 20, defaultSize: 30, class: 'items-center justify-center text-muted font-medium' },
  { slot: 'right', defaultSize: 70, class: 'items-center justify-center text-muted font-medium' }
]
</script>

<template>
  <div class="w-full h-96">
    <USplitter id="splitter-custom-handle-example" :items="items" :ui="{ handle: 'data-[orientation=horizontal]:w-px data-[orientation=vertical]:h-px bg-border transition-colors data-[state=hover]:bg-primary data-[state=drag]:bg-primary' }" class="rounded-lg border border-default overflow-hidden">
      <template #left>
        Left
      </template>

      <template #right>
        Right
      </template>
    </USplitter>
  </div>
</template>
