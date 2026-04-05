<script setup lang="ts">
import type { TransferListItem } from '@nuxt/ui'

const items: TransferListItem[] = Array.from({ length: 1000 }, (_, i) => ({
  label: `Item ${i + 1}`,
  icon: 'i-lucide-file',
  value: i + 1
}))

const value = ref<TransferListItem[]>([])
</script>

<template>
  <UTransferList
    v-model="value"
    class="w-full"
    :items="items"
    virtualize
  />
</template>
