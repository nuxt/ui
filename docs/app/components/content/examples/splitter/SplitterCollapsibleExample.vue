<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const items: SplitterItem[] = [
  { slot: 'sidebar', sizeUnit: 'px', minSize: 150, defaultSize: 250, collapsible: true, collapsedSize: 48, class: 'bg-elevated/50 border border-default rounded-xl' },
  { slot: 'main', class: 'bg-elevated/50 border border-default rounded-xl items-center justify-center text-muted font-medium' }
]
</script>

<template>
  <div class="w-full h-96">
    <USplitter id="splitter-collapsible-example" :items="items">
      <template #sidebar="{ collapsed, collapse, expand }">
        <div class="flex-1 flex items-center justify-center p-2">
          <UButton
            :icon="collapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
            :label="collapsed ? undefined : 'Collapse'"
            :aria-label="collapsed ? 'Expand' : undefined"
            color="neutral"
            variant="subtle"
            @click="collapsed ? expand() : collapse()"
          />
        </div>
      </template>

      <template #main>
        Main
      </template>
    </USplitter>
  </div>
</template>
