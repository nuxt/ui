<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items: SelectMenuItem[][] = [Array(5000).fill(0).map((_, i) => ({ label: `item-${i}`, value: i }))]
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <USelectMenu
        :items="items"
        placeholder="Search..."
      />
    </div>
  </div>
</template>
