<script setup lang="ts">
import type { InputMenuItem } from '@nuxt/ui'

const items: InputMenuItem[] = Array(1000).fill(0).map((_, i) => ({
  label: `item-${i}`,
  value: i
}))
</script>

<template>
  <UInputMenu virtualize :items="items" class="w-48" />
</template>
