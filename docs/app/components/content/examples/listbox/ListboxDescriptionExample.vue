<script setup lang="ts">
import type { ListboxItem } from '@nuxt/ui'

const items: ListboxItem[] = [
  { label: 'France', description: 'The Hexagon', icon: 'i-lucide-map-pin', value: 'FR' },
  { label: 'Germany', description: 'The Federal Republic', icon: 'i-lucide-map-pin', value: 'DE' },
  { label: 'Italy', description: 'The Boot', icon: 'i-lucide-map-pin', value: 'IT' },
  { label: 'Spain', description: 'The Bull Skin', icon: 'i-lucide-map-pin', value: 'ES' },
  { label: 'Netherlands', description: 'The Low Country', icon: 'i-lucide-map-pin', value: 'NL' },
  { label: 'Poland', description: 'The Heart of Europe', icon: 'i-lucide-map-pin', value: 'PL' }
]

const value = ref<ListboxItem[]>([])
</script>

<template>
  <UListbox
    v-model="value"
    :items="items"
    multiple
    class="w-full"
  />
</template>
