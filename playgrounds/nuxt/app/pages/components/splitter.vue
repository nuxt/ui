<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const orientation = ref('horizontal' as 'horizontal' | 'vertical')

// Transparent handle acts as the gap between panels (Reka demo style).
const handle = 'bg-transparent data-[state=hover]:bg-transparent data-[state=drag]:bg-transparent data-[orientation=horizontal]:w-2 data-[orientation=vertical]:h-2'

const card = 'bg-elevated border border-default rounded-xl items-center justify-center text-muted font-semibold'

const items: SplitterItem[] = [
  { slot: 'a', min: 20, class: card },
  { slot: 'bc', min: 20 }
]

const nested: SplitterItem[] = [
  { slot: 'b', min: 20, class: card },
  { slot: 'c', min: 20, class: card }
]
</script>

<template>
  <Navbar>
    <USelect v-model="orientation" :items="['horizontal', 'vertical']" class="w-48" />
  </Navbar>

  <div class="flex-1 w-full p-8">
    <USplitter :orientation="orientation" :items="items" :ui="{ handle }" class="size-full">
      <template #a>
        Panel A
      </template>

      <template #bc>
        <USplitter orientation="vertical" :items="nested" :ui="{ handle }" class="size-full">
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
