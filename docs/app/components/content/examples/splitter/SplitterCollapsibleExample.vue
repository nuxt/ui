<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const items: SplitterItem[] = [
  { slot: 'sidebar', unit: 'px', min: 150, default: 250, collapsible: true, collapsedSize: 48 },
  { slot: 'main' }
]
</script>

<template>
  <div class="w-full h-96">
    <USplitter :items="items">
      <template #sidebar="{ collapsed, collapse, expand }">
        <div class="flex-1 flex items-center justify-center p-2">
          <UButton
            :icon="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
            :label="collapsed ? undefined : 'Collapse'"
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
  </div>
</template>
