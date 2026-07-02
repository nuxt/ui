<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const orientation = ref('horizontal' as 'horizontal' | 'vertical')

const items: SplitterItem[] = [
  { slot: 'sidebar', min: 15, default: 25, collapsible: true, collapsedSize: 0 },
  { slot: 'main' }
]

const nested: SplitterItem[] = [
  { slot: 'top' },
  { slot: 'bottom' }
]
</script>

<template>
  <div class="p-4 space-y-4">
    <USelect v-model="orientation" :items="['horizontal', 'vertical']" class="w-48" />

    <USplitter :orientation="orientation" :items="items" class="h-96 border border-default rounded-md">
      <template #sidebar="{ collapsed, collapse, expand }">
        <div class="flex-1 flex items-center justify-center">
          <UButton
            :label="collapsed ? 'Expand' : 'Collapse'"
            color="neutral"
            variant="subtle"
            @click="collapsed ? expand() : collapse()"
          />
        </div>
      </template>

      <template #main>
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
  </div>
</template>
