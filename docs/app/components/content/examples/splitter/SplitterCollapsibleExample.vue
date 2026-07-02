<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const items: SplitterItem[] = [
  { slot: 'sidebar', min: 15, default: 25, collapsible: true, collapsedSize: 0 },
  { slot: 'main' }
]
</script>

<template>
  <USplitter :items="items" class="h-96">
    <template #sidebar="{ collapsed, collapse, expand }">
      <div class="flex-1 flex items-center justify-center p-4">
        <UButton
          :label="collapsed ? 'Expand' : 'Collapse'"
          color="neutral"
          variant="subtle"
          @click="collapsed ? expand() : collapse()"
        />
      </div>
    </template>

    <template #main>
      <Placeholder class="size-full" />
    </template>
  </USplitter>
</template>
