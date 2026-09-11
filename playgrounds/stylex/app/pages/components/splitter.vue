<script setup lang="ts">
import type { SplitterItem } from '@nuxt/ui'

const pg = usePg()

const card = pg.bg_elevated_50_border_border_default_rounded_xl_items_center_justify_center_text_muted_fon

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

  <div :class="pg.flex_1_w_full">
    <USplitter id="splitter" orientation="horizontal" :items="items">
      <template #a>
        Panel A
      </template>

      <template #bc>
        <USplitter id="splitter-nested" orientation="vertical" :items="nested">
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
