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

const value = ref<ListboxItem[]>([items[2]!, items[4]!])
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <UListbox
      v-model="value"
      :items="items"
      multiple
      class="w-full"
    />

    <p class="text-sm text-muted">
      Selected: {{ value.map(i => i.label).join(', ') || 'None' }}
    </p>
  </div>
</template>
