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

const value = ref<TransferListItem[]>([items[2]!, items[4]!])
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <UTransferList
      v-model="value"
      :items="items"
    />

    <p class="text-sm text-muted">
      Selected: {{ value.map(i => i.label).join(', ') || 'None' }}
    </p>
  </div>
</template>
