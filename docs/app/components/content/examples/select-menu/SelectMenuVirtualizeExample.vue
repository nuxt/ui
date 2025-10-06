<script setup lang="ts">
import type { SelectMenuItem } from '@nuxt/ui'

const items: SelectMenuItem[] = Array(1000).fill(0).map((_, i) => ({
  label: `item-${i}`,
  value: i
}))
</script>

<template>
  <USelectMenu virtualize :items="items" class="w-48" />
</template>
