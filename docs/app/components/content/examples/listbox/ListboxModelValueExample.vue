<script setup lang="ts">
import type { ListboxItem } from '@nuxt/ui'

const items: ListboxItem[] = [
  { label: 'France', icon: 'i-lucide-map-pin', value: 'FR' },
  { label: 'Germany', icon: 'i-lucide-map-pin', value: 'DE' },
  { label: 'Italy', icon: 'i-lucide-map-pin', value: 'IT' },
  { label: 'Spain', icon: 'i-lucide-map-pin', value: 'ES' },
  { label: 'Netherlands', icon: 'i-lucide-map-pin', value: 'NL' },
  { label: 'Poland', icon: 'i-lucide-map-pin', value: 'PL' }
]

const value = ref<ListboxItem>(items[2]!)
</script>

<template>
  <UListbox
    v-model="value"
    :items="items"
    class="w-full"
  />
</template>
