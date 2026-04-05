<script setup lang="ts">
import type { TransferListItem } from '@nuxt/ui'

const items: TransferListItem[] = [
  { label: 'France', icon: 'i-lucide-map-pin', value: 'FR' },
  { label: 'Germany', icon: 'i-lucide-map-pin', value: 'DE' },
  { label: 'Italy', icon: 'i-lucide-map-pin', value: 'IT' },
  { label: 'Spain', icon: 'i-lucide-map-pin', value: 'ES' },
  { label: 'Netherlands', icon: 'i-lucide-map-pin', value: 'NL' },
  { label: 'Poland', icon: 'i-lucide-map-pin', value: 'PL' }
]

const value = ref<TransferListItem[]>([])
</script>

<template>
  <UTransferList
    v-model="value"
    class="w-full"
    :items="items"
    :transfer="{ color: 'primary', variant: 'solid', icon: 'i-lucide-arrow-right' }"
    :remove="{ color: 'primary', variant: 'solid', icon: 'i-lucide-arrow-left' }"
  />
</template>
