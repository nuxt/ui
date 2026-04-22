<script setup lang="ts">
import type { ListboxItem } from '@nuxt/ui'

const items: ListboxItem[] = [
  { label: 'France', icon: 'i-lucide-map-pin', value: 'FR' },
  { label: 'Germany', icon: 'i-lucide-map-pin', value: 'DE' },
  { label: 'Italy', icon: 'i-lucide-map-pin', value: 'IT' },
  { label: 'Spain', icon: 'i-lucide-map-pin', value: 'ES' },
  { label: 'Netherlands', icon: 'i-lucide-map-pin', value: 'NL' },
  { label: 'Poland', icon: 'i-lucide-map-pin', value: 'PL' },
  { label: 'Belgium', icon: 'i-lucide-map-pin', value: 'BE' },
  { label: 'Portugal', icon: 'i-lucide-map-pin', value: 'PT' }
]

const targetItems = ref<ListboxItem[]>([])
const sourceSelection = ref<ListboxItem[]>([])
const targetSelection = ref<ListboxItem[]>([])

const sourceItems = computed(() => items.filter(item => !targetItems.value.some(t => t.value === item.value)))

function transferSelected() {
  targetItems.value = [...targetItems.value, ...sourceSelection.value]
  sourceSelection.value = []
}

function removeSelected() {
  targetItems.value = targetItems.value.filter(item => !targetSelection.value.some(t => t.value === item.value))
  targetSelection.value = []
}
</script>

<template>
  <div class="flex items-stretch gap-4 w-full">
    <div class="flex flex-col flex-1 gap-1">
      <span class="text-sm font-medium text-highlighted">Available</span>

      <UListbox
        v-model="sourceSelection"
        :items="sourceItems"
        multiple
        filter
        class="size-full"
      />
    </div>

    <div class="flex flex-col items-center justify-center gap-1">
      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="outline"
        :disabled="!sourceSelection.length"
        @click="transferSelected"
      />
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="outline"
        :disabled="!targetSelection.length"
        @click="removeSelected"
      />
    </div>

    <div class="flex flex-col flex-1 gap-1">
      <span class="text-sm font-medium text-highlighted">Selected</span>

      <UListbox
        v-model="targetSelection"
        :items="targetItems"
        multiple
        filter
        class="size-full"
      />
    </div>
  </div>
</template>
