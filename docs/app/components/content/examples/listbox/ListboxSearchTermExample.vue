<script setup lang="ts">
const searchTerm = ref('F')
const items = ref([
  { label: 'France', icon: 'i-lucide-map-pin', value: 'FR' },
  { label: 'Germany', icon: 'i-lucide-map-pin', value: 'DE' },
  { label: 'Italy', icon: 'i-lucide-map-pin', value: 'IT' },
  { label: 'Spain', icon: 'i-lucide-map-pin', value: 'ES' },
  { label: 'Netherlands', icon: 'i-lucide-map-pin', value: 'NL' },
  { label: 'Poland', icon: 'i-lucide-map-pin', value: 'PL' }
])
const value = ref()
</script>

<template>
  <UListbox v-model="value" v-model:search-term="searchTerm" filter :items="items" class="w-full" />
</template>
