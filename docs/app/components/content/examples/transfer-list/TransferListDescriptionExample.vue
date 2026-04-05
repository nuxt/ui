<script setup lang="ts">
import type { TransferListItem } from '@nuxt/ui'

const items: TransferListItem[] = [
  { label: 'France', description: 'The Hexagon', icon: 'i-lucide-map-pin', value: 'FR' },
  { label: 'Germany', description: 'The Federal Republic', icon: 'i-lucide-map-pin', value: 'DE' },
  { label: 'Italy', description: 'The Boot', icon: 'i-lucide-map-pin', value: 'IT' },
  { label: 'Spain', description: 'The Bull Skin', icon: 'i-lucide-map-pin', value: 'ES' },
  { label: 'Netherlands', description: 'The Low Country', icon: 'i-lucide-map-pin', value: 'NL' },
  { label: 'Poland', description: 'The Heart of Europe', icon: 'i-lucide-map-pin', value: 'PL' }
]

const value = ref<TransferListItem[]>([])
</script>

<template>
  <UTransferList
    v-model="value"
    class="w-full"
    :items="items"
  />
</template>
