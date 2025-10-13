<script setup lang="ts">
import type { CommandPaletteItem } from '@nuxt/ui'

const items: CommandPaletteItem[] = Array(1000)
  .fill(0)
  .map((_, value) => ({
    label: `item-${value}`,
    value
  }))

const groups = [
  {
    id: 'items',
    items
  }
]
</script>

<template>
  <UCommandPalette
    virtualize
    :fuse="{ resultLimit: 1000 }"
    :groups="groups"
    class="flex-1 h-80"
  />
</template>
